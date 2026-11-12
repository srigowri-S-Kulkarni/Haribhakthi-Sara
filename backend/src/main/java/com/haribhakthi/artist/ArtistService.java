package com.haribhakthi.artist;

import com.haribhakthi.common.dto.ArtistDto;
import com.haribhakthi.common.exception.BadRequestException;
import com.haribhakthi.common.exception.ResourceNotFoundException;
import com.haribhakthi.song.SongRepository;
import com.haribhakthi.storage.StorageService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ArtistService {

    private final ArtistRepository artistRepository;
    private final SongRepository songRepository;
    private final StorageService storageService;

    public ArtistService(ArtistRepository artistRepository, SongRepository songRepository, StorageService storageService) {
        this.artistRepository = artistRepository;
        this.songRepository = songRepository;
        this.storageService = storageService;
    }

    public List<ArtistDto> getAllArtists() {
        return artistRepository.findAll().stream()
                .map(artist -> {
                    long count = songRepository.countByArtistId(artist.getId());
                    return new ArtistDto(artist, count);
                })
                .collect(Collectors.toList());
    }

    public ArtistDto getArtistById(UUID id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));
        long count = songRepository.countByArtistId(artist.getId());
        return new ArtistDto(artist, count);
    }

    @Transactional
    public ArtistDto createArtist(String name, String description, MultipartFile imageFile) {
        if (name == null || name.isBlank()) {
            throw new BadRequestException("Artist name is required.");
        }

        String imagePath = null;
        if (imageFile != null && !imageFile.isEmpty()) {
            imagePath = storageService.store(imageFile, "images/artists");
        }

        Artist artist = new Artist(name.trim(), imagePath, description != null ? description.trim() : null);
        Artist saved = artistRepository.save(artist);
        return new ArtistDto(saved, 0);
    }

    @Transactional
    public ArtistDto updateArtist(UUID id, String name, String description, MultipartFile imageFile) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));

        if (name != null && !name.isBlank()) {
            artist.setName(name.trim());
        }
        if (description != null) {
            artist.setDescription(description.trim());
        }
        if (imageFile != null && !imageFile.isEmpty()) {
            // Cleanup previous profile image if present
            if (artist.getProfileImagePath() != null) {
                storageService.delete(artist.getProfileImagePath());
            }
            String newImagePath = storageService.store(imageFile, "images/artists");
            artist.setProfileImagePath(newImagePath);
        }

        Artist updated = artistRepository.save(artist);
        long count = songRepository.countByArtistId(updated.getId());
        return new ArtistDto(updated, count);
    }

    @Transactional
    public void deleteArtist(UUID id) {
        Artist artist = artistRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Artist not found with id: " + id));

        // Enforce deletion rule: Do not delete artist if songs still exist
        long songCount = songRepository.countByArtistId(id);
        if (songCount > 0) {
            throw new BadRequestException("Cannot delete artist while songs belonging to this artist still exist (" + songCount + " songs found). Please remove or delete the artist's songs first.");
        }

        if (artist.getProfileImagePath() != null) {
            storageService.delete(artist.getProfileImagePath());
        }

        artistRepository.delete(artist);
    }
}
