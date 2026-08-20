package com.haribhakthi.playlist;

import com.haribhakthi.common.dto.PlaylistDto;
import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.common.exception.BadRequestException;
import com.haribhakthi.common.exception.ForbiddenException;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.song.Song;
import com.haribhakthi.song.SongRepository;
import com.haribhakthi.song.SongStatus;
import com.haribhakthi.storage.StorageService;
import com.haribhakthi.user.User;
import com.haribhakthi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PlaylistService {

    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;
    private final StorageService storageService;

    public PlaylistService(PlaylistRepository playlistRepository, PlaylistSongRepository playlistSongRepository,
                           SongRepository songRepository, UserRepository userRepository, StorageService storageService) {
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
        this.storageService = storageService;
    }

    // Public Curated Playlists
    public List<PlaylistDto> getPublicCuratedPlaylists() {
        return playlistRepository.findByPlaylistType(PlaylistType.CURATED).stream()
                .map(this::toPlaylistDtoWithActiveSongs)
                .collect(Collectors.toList());
    }

    public PlaylistDto getPlaylistById(UUID id, UUID currentUserId) {
        Playlist playlist = playlistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + id));

        // Ownership check for personal playlists
        if (playlist.getPlaylistType() == PlaylistType.PERSONAL) {
            if (currentUserId == null || !playlist.getUser().getId().equals(currentUserId)) {
                throw new ForbiddenException("You do not have permission to view this personal playlist.");
            }
        }

        return toPlaylistDtoWithActiveSongs(playlist);
    }

    // User Personal Playlists
    public List<PlaylistDto> getUserPlaylists(UUID userId) {
        return playlistRepository.findByUserIdAndPlaylistType(userId, PlaylistType.PERSONAL).stream()
                .map(this::toPlaylistDtoWithActiveSongs)
                .collect(Collectors.toList());
    }

    @Transactional
    public PlaylistDto createPersonalPlaylist(UUID userId, String name, String description, MultipartFile coverImage) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Playlist name is required.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String coverPath = null;
        if (coverImage != null && !coverImage.isEmpty()) {
            coverPath = storageService.store(coverImage, "images/playlists");
        }

        Playlist playlist = new Playlist(user, name.trim(), description, coverPath, PlaylistType.PERSONAL);
        Playlist saved = playlistRepository.save(playlist);
        return new PlaylistDto(saved, List.of());
    }

    // Admin Curated Playlist Creation
    @Transactional
    public PlaylistDto createCuratedPlaylist(UUID adminUserId, String name, String description, MultipartFile coverImage) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Playlist name is required.");
        }

        User adminUser = userRepository.findById(adminUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Admin user not found with id: " + adminUserId));

        String coverPath = null;
        if (coverImage != null && !coverImage.isEmpty()) {
            coverPath = storageService.store(coverImage, "images/playlists");
        }

        Playlist playlist = new Playlist(adminUser, name.trim(), description, coverPath, PlaylistType.CURATED);
        Playlist saved = playlistRepository.save(playlist);
        return new PlaylistDto(saved, List.of());
    }

    // Add Song to Playlist
    @Transactional
    public PlaylistDto addSongToPlaylist(UUID playlistId, UUID songId, UUID currentUserId, boolean isAdmin) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        validatePlaylistAccess(playlist, currentUserId, isAdmin);

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));

        if (song.getStatus() != SongStatus.ACTIVE) {
            throw new BadRequestException("Inactive songs cannot be added to playlists.");
        }

        if (playlistSongRepository.existsByPlaylistIdAndSongId(playlistId, songId)) {
            throw new BadRequestException("Song is already in this playlist.");
        }

        Integer nextPosition = playlistSongRepository.findMaxPositionByPlaylistId(playlistId) + 1;
        PlaylistSong playlistSong = new PlaylistSong(playlist, song, nextPosition);
        playlistSongRepository.save(playlistSong);

        return toPlaylistDtoWithActiveSongs(playlist);
    }

    // Remove Song from Playlist
    @Transactional
    public PlaylistDto removeSongFromPlaylist(UUID playlistId, UUID songId, UUID currentUserId, boolean isAdmin) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        validatePlaylistAccess(playlist, currentUserId, isAdmin);

        playlistSongRepository.deleteByPlaylistIdAndSongId(playlistId, songId);
        return toPlaylistDtoWithActiveSongs(playlist);
    }

    // Delete Playlist
    @Transactional
    public void deletePlaylist(UUID playlistId, UUID currentUserId, boolean isAdmin) {
        Playlist playlist = playlistRepository.findById(playlistId)
                .orElseThrow(() -> new ResourceNotFoundException("Playlist not found with id: " + playlistId));

        validatePlaylistAccess(playlist, currentUserId, isAdmin);

        // Delete junction records (songs remain untouched)
        playlistSongRepository.deleteByPlaylistId(playlistId);

        if (playlist.getCoverImagePath() != null) {
            storageService.delete(playlist.getCoverImagePath());
        }

        playlistRepository.delete(playlist);
    }

    private void validatePlaylistAccess(Playlist playlist, UUID currentUserId, boolean isAdmin) {
        if (playlist.getPlaylistType() == PlaylistType.CURATED) {
            if (!isAdmin) {
                throw new ForbiddenException("Only administrators can modify curated playlists.");
            }
        } else if (playlist.getPlaylistType() == PlaylistType.PERSONAL) {
            if (currentUserId == null || !playlist.getUser().getId().equals(currentUserId)) {
                throw new ForbiddenException("You do not have permission to modify this playlist.");
            }
        }
    }

    private PlaylistDto toPlaylistDtoWithActiveSongs(Playlist playlist) {
        List<PlaylistSong> items = playlistSongRepository.findByPlaylistIdOrderByPositionAsc(playlist.getId());
        List<SongDto> songDtos = items.stream()
                .map(PlaylistSong::getSong)
                .filter(song -> song.getStatus() == SongStatus.ACTIVE)
                .map(SongDto::new)
                .collect(Collectors.toList());
        return new PlaylistDto(playlist, songDtos);
    }
}
