package com.haribhakthi.storage;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface StorageService {
    /**
     * Stores an uploaded file in the specified subfolder (e.g., "audio", "images/artists", "images/songs").
     * Returns the relative logical key (e.g., "audio/3b7d4bad-9bdd-2b0d.mp3").
     */
    String store(MultipartFile file, String subFolder);

    /**
     * Loads a file resource based on its relative logical key.
     */
    Resource loadAsResource(String logicalPath);

    /**
     * Deletes the physical file associated with a relative logical key.
     */
    void delete(String logicalPath);
}
