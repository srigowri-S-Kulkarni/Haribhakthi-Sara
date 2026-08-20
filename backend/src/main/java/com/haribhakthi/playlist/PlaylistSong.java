package com.haribhakthi.playlist;

import com.haribhakthi.song.Song;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "playlist_songs", uniqueConstraints = {
    @UniqueConstraint(name = "uq_playlist_song", columnNames = {"playlist_id", "song_id"}),
    @UniqueConstraint(name = "uq_playlist_position", columnNames = {"playlist_id", "position"})
})
public class PlaylistSong {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "song_id", nullable = false)
    private Song song;

    @Column(nullable = false)
    private Integer position;

    @Column(name = "added_at", insertable = false, updatable = false)
    private ZonedDateTime addedAt;

    public PlaylistSong() {}

    public PlaylistSong(Playlist playlist, Song song, Integer position) {
        this.playlist = playlist;
        this.song = song;
        this.position = position;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Playlist getPlaylist() { return playlist; }
    public void setPlaylist(Playlist playlist) { this.playlist = playlist; }

    public Song getSong() { return song; }
    public void setSong(Song song) { this.song = song; }

    public Integer getPosition() { return position; }
    public void setPosition(Integer position) { this.position = position; }

    public ZonedDateTime getAddedAt() { return addedAt; }
}
