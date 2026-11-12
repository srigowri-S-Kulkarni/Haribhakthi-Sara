package com.haribhakthi.favorite;

import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.common.exception.BadRequestException;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.song.Song;
import com.haribhakthi.song.SongRepository;
import com.haribhakthi.song.SongStatus;
import com.haribhakthi.user.User;
import com.haribhakthi.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final SongRepository songRepository;
    private final UserRepository userRepository;

    public FavoriteService(FavoriteRepository favoriteRepository, SongRepository songRepository, UserRepository userRepository) {
        this.favoriteRepository = favoriteRepository;
        this.songRepository = songRepository;
        this.userRepository = userRepository;
    }

    public List<SongDto> getUserFavorites(UUID userId) {
        return favoriteRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(Favorite::getSong)
                .filter(song -> song.getStatus() == SongStatus.ACTIVE)
                .map(SongDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void addFavorite(UUID userId, UUID songId) {
        if (favoriteRepository.existsByUserIdAndSongId(userId, songId)) {
            return; // Already favorited
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Song song = songRepository.findById(songId)
                .orElseThrow(() -> new ResourceNotFoundException("Song not found with id: " + songId));

        if (song.getStatus() != SongStatus.ACTIVE) {
            throw new BadRequestException("Cannot favorite an inactive song.");
        }

        Favorite favorite = new Favorite(user, song);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(UUID userId, UUID songId) {
        favoriteRepository.deleteByUserIdAndSongId(userId, songId);
    }

    public boolean isFavorite(UUID userId, UUID songId) {
        return favoriteRepository.existsByUserIdAndSongId(userId, songId);
    }
}
