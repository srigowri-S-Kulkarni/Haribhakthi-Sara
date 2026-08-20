package com.haribhakthi.song;

import com.haribhakthi.artist.Artist;
import com.haribhakthi.artist.ArtistRepository;
import com.haribhakthi.favorite.FavoriteRepository;
import com.haribhakthi.history.ListeningHistoryRepository;
import com.haribhakthi.playlist.PlaylistSongRepository;
import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.common.exception.BadRequestException;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.security.MessageDigest;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SongService {

    private final SongRepository songRepository;
    private final ArtistRepository artistRepository;
    private final StorageService storageService;
    private final PlaylistSongRepository playlistSongRepository;
    private final FavoriteRepository favoriteRepository;
    private final ListeningHistoryRepository listeningHistoryRepository;

    public SongService(SongRepository songRepository,
                       ArtistRepository artistRepository,
                       StorageService storageService,
                       PlaylistSongRepository playlistSongRepository,
                       FavoriteRepository favoriteRepository,
                       ListeningHistoryRepository listeningHistoryRepository) {
        this.songRepository = songRepository;
        this.artistRepository = artistRepository;
        this.storageService = storageService;
        this.playlistSongRepository = playlistSongRepository;
        this.favoriteRepository = favoriteRepository;
        this.listeningHistoryRepository = listeningHistoryRepository;
    }

    public List<SongDto> getActiveSongs() {
        return songRepository.findByStatus(SongStatus.ACTIVE).stream()
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    public List<SongDto> getActiveSongsByArtist(UUID artistId) {
        return songRepository.findByArtistIdAndStatus(artistId, SongStatus.ACTIVE).stream()
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    public SongDto getActiveSongById(UUID id) {
        Song song = songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
        if (song.getStatus() != SongStatus.ACTIVE) {
            throw new ResourceNotFoundException("Song is inactive or unavailable.");
        }
        return new SongDto(song);
    }

    public List<SongDto> searchActiveSongs(String query) {
        if (query == null || query.isBlank()) {
            return getActiveSongs();
        }
        return songRepository.searchActiveSongs(query.trim(), SongStatus.ACTIVE).stream()
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    // Admin methods
    public List<SongDto> getAllSongsForAdmin() {
        return songRepository.findAll().stream()
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    public Song getSongEntityById(UUID id) {
        return songRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + id));
    }

    @Transactional
    public SongDto createSong(UUID artistId, String title, String description, String lyrics,
                              MultipartFile audioFile, MultipartFile coverImage, Integer durationSeconds) {
        if (title == null || title.isBlank()) {
            throw new BadRequestException("Song title is required.");
        }
        if (audioFile == null || audioFile.isEmpty()) {
            throw new BadRequestException("Audio file is required.");
        }

        Artist artist = artistRepository.findById(artistId)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));

        // SHA-256 hash of the audio file to detect identical duplicate .mp3 file uploads
        String audioHash = calculateSHA256Hash(audioFile);
        if (audioHash != null) {
            List<Song> existingWithHash = songRepository.findByAudioHash(audioHash);
            if (!existingWithHash.isEmpty()) {
                Song existing = existingWithHash.get(0);
                throw new BadRequestException("This audio file already exists in the system as song '" + existing.getTitle() + "' under artist '" + existing.getArtist().getName() + "'.");
            }
        }

        // Store physical files using StorageService abstraction
        String audioPath = storageService.store(audioFile, "audio");
        String coverPath = null;
        if (coverImage != null && !coverImage.isEmpty()) {
            coverPath = storageService.store(coverImage, "images/songs");
        }

        Song song = new Song(artist, title.trim(), description, lyrics, audioPath, audioHash, coverPath,
                durationSeconds != null ? durationSeconds : 0, SongStatus.ACTIVE);

        Song saved = songRepository.save(song);
        return new SongDto(saved);
    }

    @Transactional
    public SongDto updateSong(UUID songId, UUID artistId, String title, String description, String lyrics,
                              MultipartFile coverImage, Integer durationSeconds) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));

        if (artistId != null) {
            Artist artist = artistRepository.findById(artistId)
                    .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + artistId));
            song.setArtist(artist);
        }

        if (title != null && !title.isBlank()) {
            song.setTitle(title.trim());
        }
        if (description != null) {
            song.setDescription(description.trim());
        }
        if (lyrics != null) {
            song.setLyrics(lyrics);
        }
        if (durationSeconds != null) {
            song.setDurationSeconds(durationSeconds);
        }

        if (coverImage != null && !coverImage.isEmpty()) {
            if (song.getCoverImagePath() != null) {
                storageService.delete(song.getCoverImagePath());
            }
            String newCoverPath = storageService.store(coverImage, "images/songs");
            song.setCoverImagePath(newCoverPath);
        }

        Song updated = songRepository.save(song);
        return new SongDto(updated);
    }

    @Transactional
    public SongDto softDeleteSong(UUID songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));
        song.setStatus(SongStatus.INACTIVE);
        Song updated = songRepository.save(song);
        return new SongDto(updated);
    }

    @Transactional
    public SongDto restoreSong(UUID songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));
        song.setStatus(SongStatus.ACTIVE);
        Song updated = songRepository.save(song);
        return new SongDto(updated);
    }

    @Transactional
    public void permanentDeleteSong(UUID songId) {
        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));

        // 1. Delete references in junction/dependent tables
        playlistSongRepository.deleteBySongId(songId);
        favoriteRepository.deleteBySongId(songId);
        listeningHistoryRepository.deleteBySongId(songId);

        // 2. Delete physical media files via StorageService
        if (song.getAudioFilePath() != null) {
            storageService.delete(song.getAudioFilePath());
        }
        if (song.getCoverImagePath() != null) {
            storageService.delete(song.getCoverImagePath());
        }

        // 3. Delete database record
        songRepository.delete(song);
    }

    private String calculateSHA256Hash(MultipartFile file) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(file.getBytes());
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) hexString.append('0');
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (Exception e) {
            return null;
        }
    }
}
