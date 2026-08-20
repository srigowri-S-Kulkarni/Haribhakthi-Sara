package com.haribhakthi.history;

import com.haribhakthi.common.dto.SongDto;
import com.haribhakthi.config.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    private final HistoryService historyService;

    public HistoryController(HistoryService historyService) {
        this.historyService = historyService;
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getRecentlyPlayed(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(historyService.getRecentlyPlayed(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<Void> recordPlayback(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Map<String, Object> payload) {
        if (payload == null || !payload.containsKey("songId")) {
            return ResponseEntity.badRequest().build();
        }

        UUID songId = UUID.fromString((String) payload.get("songId"));
        
        Integer progress = 0;
        Object rawProgress = payload.get("progress");
        if (rawProgress instanceof Number) {
            progress = ((Number) rawProgress).intValue();
        }
        
        Boolean completed = Boolean.TRUE.equals(payload.get("completed"));

        historyService.recordPlayback(principal.getId(), songId, progress, completed);
        return ResponseEntity.ok().build();
    }
}
