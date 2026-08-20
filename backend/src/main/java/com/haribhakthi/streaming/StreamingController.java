package com.haribhakthi.streaming;

import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.song.Song;
import com.haribhakthi.song.SongService;
import com.haribhakthi.song.SongStatus;
import com.haribhakthi.storage.StorageService;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.ResourceRegion;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/songs")
public class StreamingController {

    private final SongService songService;
    private final StorageService storageService;

    public StreamingController(SongService songService, StorageService storageService) {
        this.songService = songService;
        this.storageService = storageService;
    }

    @GetMapping("/{id}/stream")
    public ResponseEntity<ResourceRegion> streamAudio(
            @PathVariable UUID id,
            @RequestHeader HttpHeaders headers) throws IOException {

        Song song = songService.getSongEntityById(id);
        if (song.getStatus() != SongStatus.ACTIVE) {
            throw new ResourceNotFoundException("Song is inactive and cannot be streamed.");
        }

        Resource audioResource = storageService.loadAsResource(song.getAudioFilePath());
        long contentLength = audioResource.contentLength();

        String filename = song.getAudioFilePath().toLowerCase();
        MediaType mediaType = MediaType.parseMediaType("audio/mpeg");
        if (filename.endsWith(".wav")) {
            mediaType = MediaType.parseMediaType("audio/wav");
        } else if (filename.endsWith(".ogg")) {
            mediaType = MediaType.parseMediaType("audio/ogg");
        } else if (filename.endsWith(".m4a") || filename.endsWith(".aac")) {
            mediaType = MediaType.parseMediaType("audio/mp4");
        }

        HttpRange range = headers.getRange().isEmpty() ? null : headers.getRange().get(0);

        if (range != null) {
            long start = range.getRangeStart(contentLength);
            long end = range.getRangeEnd(contentLength);
            long rangeLength = Math.min(1024 * 1024L, end - start + 1);
            ResourceRegion region = new ResourceRegion(audioResource, start, rangeLength);

            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT)
                    .contentType(mediaType)
                    .body(region);
        } else {
            long rangeLength = Math.min(1024 * 1024L, contentLength);
            ResourceRegion region = new ResourceRegion(audioResource, 0, rangeLength);

            return ResponseEntity.status(HttpStatus.OK)
                    .contentType(mediaType)
                    .body(region);
        }
    }
}
