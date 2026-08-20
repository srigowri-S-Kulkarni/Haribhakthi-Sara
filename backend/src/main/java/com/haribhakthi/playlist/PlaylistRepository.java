package com.haribhakthi.playlist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, UUID> {
    List<Playlist> findByPlaylistType(PlaylistType playlistType);
    List<Playlist> findByUserIdAndPlaylistType(UUID userId, PlaylistType playlistType);
    List<Playlist> findByUserId(UUID userId);
}
