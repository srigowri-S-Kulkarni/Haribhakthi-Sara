package com.haribhakthi.song;

import com.haribhakthi.common.dto.SongDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/songs")
public class AdminSongController {

    private final SongService songService;

    public AdminSongController(SongService songService) {
        this.songService = songService;
    }

    @GetMapping
    public ResponseEntity<List<SongDto>> getAllSongsForAdmin() {
        return ResponseEntity.ok(songService.getAllSongsForAdmin());
    }

    @PostMapping
    public ResponseEntity<SongDto> createSong(
            @RequestParam("artistId") UUID artistId,
            @RequestParam("title") String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "lyrics", required = false) String lyrics,
            @RequestParam("audio") MultipartFile audioFile,
            @RequestParam(value = "cover", required = false) MultipartFile coverImage,
            @RequestParam(value = "duration", required = false, defaultValue = "0") Integer durationSeconds) {
        return ResponseEntity.ok(songService.createSong(artistId, title, description, lyrics, audioFile, coverImage, durationSeconds));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SongDto> updateSong(
            @PathVariable UUID id,
            @RequestParam(value = "artistId", required = false) UUID artistId,
            @RequestParam(value = "title", required = false) String title,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "lyrics", required = false) String lyrics,
            @RequestParam(value = "cover", required = false) MultipartFile coverImage,
            @RequestParam(value = "duration", required = false) Integer durationSeconds) {
        return ResponseEntity.ok(songService.updateSong(id, artistId, title, description, lyrics, coverImage, durationSeconds));
    }

    @PostMapping("/{id}/deactivate")
    public ResponseEntity<SongDto> softDeleteSong(@PathVariable UUID id) {
        return ResponseEntity.ok(songService.softDeleteSong(id));
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<SongDto> restoreSong(@PathVariable UUID id) {
        return ResponseEntity.ok(songService.restoreSong(id));
    }

    @DeleteMapping("/{id}/permanent")
    public ResponseEntity<Void> permanentDeleteSong(@PathVariable UUID id) {
        songService.permanentDeleteSong(id);
        return ResponseEntity.noContent().build();
    }
}
