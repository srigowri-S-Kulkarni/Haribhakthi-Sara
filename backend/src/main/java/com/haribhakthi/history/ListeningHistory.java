package com.haribhakthi.history;

import com.haribhakthi.song.Song;
import com.haribhakthi.user.User;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "listening_history")
public class ListeningHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(name = "played_at", insertable = false, updatable = false)
    private ZonedDateTime playedAt;

    @Column(name = "progress_seconds")
    private Integer progressSeconds = 0;

    @Column(nullable = false)
    private Boolean completed = false;

    public ListeningHistory() {}

    public ListeningHistory(User user, Song song, Integer progressSeconds, Boolean completed) {
        this.user = user;
        this.song = song;
        this.progressSeconds = progressSeconds != null ? progressSeconds : 0;
        this.completed = completed != null ? completed : false;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }

    public ZonedDateTime getPlayedAt() { return playedAt; }
    public void setPlayedAt(ZonedDateTime playedAt) { this.playedAt = playedAt; }

    public Integer getProgressSeconds() { return progressSeconds; }
    public void setProgressSeconds(Integer progressSeconds) { this.progressSeconds = progressSeconds; }

    public Boolean getCompleted() { return completed; }
    public void setCompleted(Boolean completed) { this.completed = completed; }
}
