package com.haribhakthi.favorite;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, UUID> {
    List<Favorite> findByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<Favorite> findByUserIdAndSongId(UUID userId, UUID songId);
    boolean existsByUserIdAndSongId(UUID userId, UUID songId);

    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.user.id = :userId AND f.song.id = :songId")
    void deleteByUserIdAndSongId(@Param("userId") UUID userId, @Param("songId") UUID songId);

    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.song.id = :songId")
    void deleteBySongId(@Param("songId") UUID songId);

    @Modifying
    @Query("DELETE FROM Favorite f WHERE f.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
}
