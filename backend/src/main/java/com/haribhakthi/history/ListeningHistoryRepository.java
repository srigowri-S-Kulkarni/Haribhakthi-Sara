package com.haribhakthi.history;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ListeningHistoryRepository extends JpaRepository<ListeningHistory, UUID> {
    List<ListeningHistory> findByUserIdOrderByPlayedAtDesc(UUID userId);

    @Modifying
    @Query("DELETE FROM ListeningHistory lh WHERE lh.song.id = :songId")
    void deleteBySongId(@Param("songId") UUID songId);

    @Modifying
    @Query("DELETE FROM ListeningHistory lh WHERE lh.user.id = :userId")
    void deleteByUserId(@Param("userId") UUID userId);
}
