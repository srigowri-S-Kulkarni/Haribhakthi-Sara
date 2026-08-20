package com.haribhakthi.common.dto;

import com.haribhakthi.song.Song;
import java.util.UUID;

public class SongDto {
    private UUID id;
    private UUID artistId;
    private String artistName;
    private String title;
    private String description;
    private String lyrics;
    private String audioFilePath;
    private String streamUrl;
    private String coverImagePath;
    private String coverImageUrl;
    private Integer durationSeconds;
    private String status;

    public SongDto() {}

    public SongDto(Song song) {
        this.id = song.getId();
        if (song.getArtist() != null) {
            this.artistId = song.getArtist().getId();
            this.artistName = song.getArtist().getName();
        }
        this.title = song.getTitle();
        this.description = song.getDescription();
        this.lyrics = song.getLyrics();
        this.audioFilePath = song.getAudioFilePath();
        this.streamUrl = "/api/songs/" + song.getId() + "/stream";
        this.coverImagePath = song.getCoverImagePath();
        this.coverImageUrl = song.getCoverImagePath() != null ? "/api/media/" + song.getCoverImagePath() : null;
        this.durationSeconds = song.getDurationSeconds();
        this.status = song.getStatus().name();
    }

    public UUID getId() { return id; }
    public UUID getArtistId() { return artistId; }
    public String getArtistName() { return artistName; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getLyrics() { return lyrics; }
    public String getAudioFilePath() { return audioFilePath; }
    public String getStreamUrl() { return streamUrl; }
    public String getCoverImagePath() { return coverImagePath; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public String getStatus() { return status; }
}
