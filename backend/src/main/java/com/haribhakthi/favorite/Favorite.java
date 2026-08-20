package com.haribhakthi.favorite;

import com.haribhakthi.song.Song;
import com.haribhakthi.user.User;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "favorites", uniqueConstraints = {
    @UniqueConstraint(name = "uq_user_favorite", columnNames = {"user_id", "song_id"})
})
public class Favorite {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    public Favorite() {}

    public Favorite(User user, Song song) {
        this.user = user;
        this.song = song;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
}
