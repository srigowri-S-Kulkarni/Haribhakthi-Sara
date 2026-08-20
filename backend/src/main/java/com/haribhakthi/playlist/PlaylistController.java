package com.haribhakthi.playlist;

import com.haribhakthi.common.dto.PlaylistDto;
import com.haribhakthi.config.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/playlists")
public class PlaylistController {

    private final PlaylistService playlistService;

    public PlaylistController(PlaylistService playlistService) {
        this.playlistService = playlistService;
    }

    @GetMapping
    public ResponseEntity<List<PlaylistDto>> getPublicCuratedPlaylists() {
        return ResponseEntity.ok(playlistService.getPublicCuratedPlaylists());
    }

    @GetMapping("/my")
    public ResponseEntity<List<PlaylistDto>> getMyPlaylists(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(playlistService.getUserPlaylists(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlaylistDto> getPlaylistById(@PathVariable UUID id,
                                                        @AuthenticationPrincipal UserPrincipal principal) {
        UUID userId = principal != null ? principal.getId() : null;
        return ResponseEntity.ok(playlistService.getPlaylistById(id, userId));
    }

    @PostMapping
    public ResponseEntity<PlaylistDto> createPersonalPlaylist(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "cover", required = false) MultipartFile coverImage) {
        return ResponseEntity.ok(playlistService.createPersonalPlaylist(principal.getId(), name, description, coverImage));
    }

    @PostMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> addSongToPlaylist(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(playlistService.addSongToPlaylist(playlistId, songId, principal.getId(), false));
    }

    @DeleteMapping("/{playlistId}/songs/{songId}")
    public ResponseEntity<PlaylistDto> removeSongFromPlaylist(
            @PathVariable UUID playlistId,
            @PathVariable UUID songId,
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(playlistService.removeSongFromPlaylist(playlistId, songId, principal.getId(), false));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePersonalPlaylist(
            @PathVariable UUID id,
            @AuthenticationPrincipal UserPrincipal principal) {
        playlistService.deletePlaylist(id, principal.getId(), false);
        return ResponseEntity.noContent().build();
    }
}
