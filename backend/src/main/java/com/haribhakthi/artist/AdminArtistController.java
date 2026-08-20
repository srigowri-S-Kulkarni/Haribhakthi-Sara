package com.haribhakthi.artist;

import com.haribhakthi.common.dto.ArtistDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/admin/artists")
public class AdminArtistController {

    private final ArtistService artistService;

    public AdminArtistController(ArtistService artistService) {
        this.artistService = artistService;
    }

    @PostMapping
    public ResponseEntity<ArtistDto> createArtist(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(artistService.createArtist(name, description, imageFile));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArtistDto> updateArtist(
            @PathVariable UUID id,
            @RequestParam(value = "name", required = false) String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) {
        return ResponseEntity.ok(artistService.updateArtist(id, name, description, imageFile));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtist(@PathVariable UUID id) {
        artistService.deleteArtist(id);
        return ResponseEntity.noContent().build();
    }
}
