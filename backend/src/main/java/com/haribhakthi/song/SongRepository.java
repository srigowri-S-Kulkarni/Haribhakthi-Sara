package com.haribhakthi.song;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SongRepository extends JpaRepository<Song, UUID> {
    List<Song> findByArtistIdAndStatus(UUID artistId, SongStatus status);
    List<Song> findByArtistId(UUID artistId);
    long countByArtistId(UUID artistId);
    List<Song> findByStatus(SongStatus status);

    Optional<Song> findByArtistIdAndTitleIgnoreCase(UUID artistId, String title);
    List<Song> findByAudioHash(String audioHash);

    @Query("SELECT s FROM Song s WHERE s.status = :status AND (LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR LOWER(s.artist.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Song> searchActiveSongs(@Param("query") String query, @Param("status") SongStatus status);
}
