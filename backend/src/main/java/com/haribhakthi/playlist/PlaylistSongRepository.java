package com.haribhakthi.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PlaylistSongRepository extends JpaRepository<PlaylistSong, UUID> {
    List<PlaylistSong> findByPlaylistIdOrderByPositionAsc(UUID playlistId);
    Optional<PlaylistSong> findByPlaylistIdAndSongId(UUID playlistId, UUID songId);
    boolean existsByPlaylistIdAndSongId(UUID playlistId, UUID songId);
    
    @Modifying
    @Query("DELETE FROM PlaylistSong ps WHERE ps.playlist.id = :playlistId AND ps.song.id = :songId")
    void deleteByPlaylistIdAndSongId(@Param("playlistId") UUID playlistId, @Param("songId") UUID songId);

    @Modifying
    @Query("DELETE FROM PlaylistSong ps WHERE ps.song.id = :songId")
    void deleteBySongId(@Param("songId") UUID songId);

    @Modifying
    @Query("DELETE FROM PlaylistSong ps WHERE ps.playlist.id = :playlistId")
    void deleteByPlaylistId(@Param("playlistId") UUID playlistId);

    @Query("SELECT COALESCE(MAX(ps.position), 0) FROM PlaylistSong ps WHERE ps.playlist.id = :playlistId")
    Integer findMaxPositionByPlaylistId(@Param("playlistId") UUID playlistId);
}
