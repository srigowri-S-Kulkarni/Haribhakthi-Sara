package com.haribhakthi.storage;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class LocalStorageService implements StorageService {

    private final Path rootLocation;

    public LocalStorageService(@Value("${app.storage.base-path:C:/haribhakthi_media_storage}") String basePath) {
        this.rootLocation = Paths.get(basePath).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation);
            Files.createDirectories(rootLocation.resolve("audio"));
            Files.createDirectories(rootLocation.resolve("images/artists"));
            Files.createDirectories(rootLocation.resolve("images/songs"));
            Files.createDirectories(rootLocation.resolve("images/playlists"));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage location", e);
        }
    }

    @Override
    public String store(MultipartFile file, String subFolder) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file.");
        }

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        // Generate safe unique UUID filename
        String safeFilename = UUID.randomUUID().toString() + extension;
        Path targetDir = rootLocation.resolve(subFolder).normalize();

        try {
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            Path destinationFile = targetDir.resolve(safeFilename).normalize();

            // Prevent path traversal security attacks
            if (!destinationFile.startsWith(rootLocation)) {
                throw new SecurityException("Cannot store file outside target directory.");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING);
            }

            // Return relative logical key (e.g., "audio/uuid.mp3")
            return subFolder + "/" + safeFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalFilename, e);
        }
    }

    @Override
    public Resource loadAsResource(String logicalPath) {
        try {
            if (logicalPath == null || logicalPath.isBlank()) {
                throw new IllegalArgumentException("Logical path cannot be null or empty");
            }

            Path file = rootLocation.resolve(logicalPath).normalize();
            if (!file.startsWith(rootLocation)) {
                throw new SecurityException("Cannot access file outside root location.");
            }

            Resource resource = new UrlResource(file.toUri());
            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Could not read file: " + logicalPath);
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Could not read file: " + logicalPath, e);
        }
    }

    @Override
    public void delete(String logicalPath) {
        if (logicalPath == null || logicalPath.isBlank()) {
            return;
        }
        try {
            Path file = rootLocation.resolve(logicalPath).normalize();
            if (file.startsWith(rootLocation) && Files.exists(file)) {
                Files.delete(file);
            }
        } catch (IOException e) {
            // Log warning or rethrow if required
            System.err.println("Failed to delete physical file: " + logicalPath + " - " + e.getMessage());
        }
    }
}
