package com.haribhakthi.playlist;

import com.haribhakthi.user.User;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "cover_image_path")
    private String coverImagePath;

    @Enumerated(EnumType.STRING)
    @Column(name = "playlist_type", nullable = false)
    private PlaylistType playlistType = PlaylistType.PERSONAL;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private ZonedDateTime updatedAt;

    public Playlist() {}

    public Playlist(User user, String name, String description, String coverImagePath, PlaylistType playlistType) {
        this.user = user;
        this.name = name;
        this.description = description;
        this.coverImagePath = coverImagePath;
        this.playlistType = playlistType != null ? playlistType : PlaylistType.PERSONAL;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCoverImagePath() { return coverImagePath; }
    public void setCoverImagePath(String coverImagePath) { this.coverImagePath = coverImagePath; }

    public PlaylistType getPlaylistType() { return playlistType; }
    public void setPlaylistType(PlaylistType playlistType) { this.playlistType = playlistType; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }
}
