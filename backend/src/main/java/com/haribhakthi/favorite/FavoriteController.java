package com.haribhakthi.favorite;

import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.config.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getMyFavorites(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(favoriteService.getUserFavorites(principal.getId()));
    }

    @PostMapping("/{songId}")
    public ResponseEntity<Void> addFavorite(@PathVariable UUID songId,
                                            @AuthenticationPrincipal UserPrincipal principal) {
        favoriteService.addFavorite(principal.getId(), songId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{songId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable UUID songId,
                                               @AuthenticationPrincipal UserPrincipal principal) {
        favoriteService.removeFavorite(principal.getId(), songId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{songId}/check")
    public ResponseEntity<Map<String, Boolean>> isFavorite(@PathVariable UUID songId,
                                                           @AuthenticationPrincipal UserPrincipal principal) {
        boolean isFav = favoriteService.isFavorite(principal.getId(), songId);
        return ResponseEntity.ok(Map.of("isFavorite", isFav));
    }
}
