package com.haribhakthi.storage;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 * Modular AWS S3 Storage Service implementation.
 * Enabled when app.storage.type=s3.
 */
@Service
@ConditionalOnProperty(name = "app.storage.type", havingValue = "s3")
public class S3StorageService implements StorageService {

    @Value("${app.storage.s3.bucket-name:haribhakthi-media}")
    private String bucketName;

    @Value("${app.storage.s3.region:ap-south-1}")
    private String region;

    @Override
    public String store(MultipartFile file, String subFolder) {
        // AWS S3 PutObject implementation stub
        throw new UnsupportedOperationException("S3 Storage provider configured but AWS S3 SDK integration pending bucket setup.");
    }

    @Override
    public Resource loadAsResource(String logicalPath) {
        // AWS S3 GetObject implementation stub
        throw new UnsupportedOperationException("S3 Storage provider configured but AWS S3 SDK integration pending bucket setup.");
    }

    @Override
    public void delete(String logicalPath) {
        // AWS S3 DeleteObject implementation stub
        System.out.println("S3 delete requested for: " + logicalPath);
    }
}
