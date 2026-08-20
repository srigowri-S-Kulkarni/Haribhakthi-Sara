package com.haribhakthi.song;

import com.haribhakthi.artist.Artist;
import jakarta.persistence.*;
import java.time.ZonedDateTime;
import java.util.UUID;

@Entity
@Table(name = "songs")
public class Song {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "artist_id", nullable = false)
    private Artist artist;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String lyrics;

    @Column(name = "audio_file_path", nullable = false)
    private String audioFilePath;

    @Column(name = "audio_hash")
    private String audioHash;

    @Column(name = "cover_image_path")
    private String coverImagePath;

    @Column(name = "duration_seconds", nullable = false)
    private Integer durationSeconds = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SongStatus status = SongStatus.ACTIVE;

    @Column(name = "created_at", insertable = false, updatable = false)
    private ZonedDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private ZonedDateTime updatedAt;

    public Song() {}

    public Song(Artist artist, String title, String description, String lyrics, String audioFilePath, String audioHash, String coverImagePath, Integer durationSeconds, SongStatus status) {
        this.artist = artist;
        this.title = title;
        this.description = description;
        this.lyrics = lyrics;
        this.audioFilePath = audioFilePath;
        this.audioHash = audioHash;
        this.coverImagePath = coverImagePath;
        this.durationSeconds = durationSeconds != null ? durationSeconds : 0;
        this.status = status != null ? status : SongStatus.ACTIVE;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public Artist getArtist() { return artist; }
    public void setArtist(Artist artist) { this.artist = artist; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getLyrics() { return lyrics; }
    public void setLyrics(String lyrics) { this.lyrics = lyrics; }

    public String getAudioFilePath() { return audioFilePath; }
    public void setAudioFilePath(String audioFilePath) { this.audioFilePath = audioFilePath; }

    public String getAudioHash() { return audioHash; }
    public void setAudioHash(String audioHash) { this.audioHash = audioHash; }

    public String getCoverImagePath() { return coverImagePath; }
    public void setCoverImagePath(String coverImagePath) { this.coverImagePath = coverImagePath; }

    public Integer getDurationSeconds() { return durationSeconds; }
    public void setDurationSeconds(Integer durationSeconds) { this.durationSeconds = durationSeconds; }

    public SongStatus getStatus() { return status; }
    public void setStatus(SongStatus status) { this.status = status; }

    public ZonedDateTime getCreatedAt() { return createdAt; }
    public ZonedDateTime getUpdatedAt() { return updatedAt; }
}
