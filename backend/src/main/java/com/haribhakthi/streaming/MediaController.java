package com.haribhakthi.streaming;

import com.haribhakthi.storage.StorageService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.HandlerMapping;

@RestController
@RequestMapping("/api/media")
public class MediaController {

    private final StorageService storageService;

    public MediaController(StorageService storageService) {
        this.storageService = storageService;
    }

    @GetMapping("/**")
    public ResponseEntity<Resource> serveMedia(HttpServletRequest request) {
        String fullPath = (String) request.getAttribute(HandlerMapping.PATH_WITHIN_HANDLER_MAPPING_ATTRIBUTE);
        if (fullPath == null) {
            fullPath = request.getRequestURI();
        }

        String path = fullPath.replaceFirst("^/api/media/?", "");
        if (path.isBlank() || path.equalsIgnoreCase("error") || path.startsWith("error/")) {
            return ResponseEntity.notFound().build();
        }

        try {
            Resource resource = storageService.loadAsResource(path);

            String contentType = "application/octet-stream";
            String lower = path.toLowerCase();
            if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (lower.endsWith(".png")) {
                contentType = "image/png";
            } else if (lower.endsWith(".webp")) {
                contentType = "image/webp";
            } else if (lower.endsWith(".mp3")) {
                contentType = "audio/mpeg";
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_TYPE, contentType)
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
