package com.haribhakthi.song;

import com.haribhakthi.common.dto.SongDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/songs")
public class SongController {

    private final SongService songService;

    public SongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getActiveSongs() {
        return ResponseEntity.ok(songService.getActiveSongs());
    }

    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<SongDto>> getActiveSongsByArtist(@PathVariable UUID artistId) {
        return ResponseEntity.ok(songService.getActiveSongsByArtist(artistId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SongDto> getActiveSongById(@PathVariable UUID id) {
        return ResponseEntity.ok(songService.getActiveSongById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SongDto>> searchSongs(@RequestParam(value = "q", required = false) String query) {
        return ResponseEntity.ok(songService.searchActiveSongs(query));
    }
}
