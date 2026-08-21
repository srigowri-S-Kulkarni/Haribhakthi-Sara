package com.haribhakthi.user;

import com.haribhakthi.common.dto.UserDto;
import com.haribhakthi.common.exception.BadRequestException;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.favorite.FavoriteRepository;
import com.haribhakthi.history.ListeningHistoryRepository;
import com.haribhakthi.playlist.Playlist;
import com.haribhakthi.playlist.PlaylistRepository;
import com.haribhakthi.playlist.PlaylistSongRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FavoriteRepository favoriteRepository;
    private final ListeningHistoryRepository listeningHistoryRepository;
    private final PlaylistRepository playlistRepository;
    private final PlaylistSongRepository playlistSongRepository;
    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       FavoriteRepository favoriteRepository,
                       ListeningHistoryRepository listeningHistoryRepository,
                       PlaylistRepository playlistRepository,
                       PlaylistSongRepository playlistSongRepository,
                       org.springframework.security.crypto.password.PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.favoriteRepository = favoriteRepository;
        this.listeningHistoryRepository = listeningHistoryRepository;
        this.playlistRepository = playlistRepository;
        this.playlistSongRepository = playlistSongRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserDto getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return new UserDto(user);
    }

    public List<UserDto> getAllUsersForAdmin() {
        return userRepository.findAll().stream()
                .map(UserDto::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto updateProfile(UUID userId, Map<String, String> updates) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (updates.containsKey("name")) {
            user.setName(updates.get("name"));
        }
        if (updates.containsKey("preferredLanguage")) {
            user.setPreferredLanguage(updates.get("preferredLanguage"));
        }
        if (updates.containsKey("email")) {
            String newEmail = updates.get("email").trim();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new BadRequestException("Email is already in use by another account.");
                }
                user.setEmail(newEmail);
            }
        }

        User updatedUser = userRepository.save(user);
        return new UserDto(updatedUser);
    }

    @Transactional
    public void changePassword(UUID userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (currentPassword == null || newPassword == null || newPassword.isBlank()) {
            throw new BadRequestException("Current password and new password are required.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public UserDto updateUserRole(UUID userId, String roleStr) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setRole(Role.valueOf(roleStr.toUpperCase()));
        User updated = userRepository.save(user);
        return new UserDto(updated);
    }

    @Transactional
    public void deleteUserAccount(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if ("admin@haribhakthi.com".equalsIgnoreCase(user.getEmail())) {
            throw new BadRequestException("The primary administrator account cannot be deleted.");
        }

        favoriteRepository.deleteByUserId(userId);
        listeningHistoryRepository.deleteByUserId(userId);

        List<Playlist> userPlaylists = playlistRepository.findByUserId(userId);
        for (Playlist playlist : userPlaylists) {
            playlistSongRepository.deleteByPlaylistId(playlist.getId());
            playlistRepository.delete(playlist);
        }

        userRepository.delete(user);
    }
}
