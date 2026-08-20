package com.haribhakthi.playlist;

import com.haribhakthi.common.dto.PlaylistDto;
import com.haribhakthi.config.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/playlists")
public class AdminPlaylistController {

    private final PlaylistService playlistService;

    public AdminPlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @PostMapping
    public ResponseEntity<PlaylistDto> createCuratedPlaylist(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "cover", required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(playlistService.createCuratedPlaylist(principal.getId(), name, description, coverImage));
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> addSongToCuratedPlaylist(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId, songId, principal.getId(), true));
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> removeSongFromCuratedPlaylist(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(playlistService.removeSongFromPlaylist(playlistId, songId, principal.getId(), true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCuratedPlaylist(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        playlistService.deletePlaylist(id, principal.getId(), true);
        return ResponseEntity.noContent().build();
    }
}
