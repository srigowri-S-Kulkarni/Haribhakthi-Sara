package com.haribhakthi.common.dto;

import com.haribhakthi.playlist.Playlist;
import java.util.List;
import java.util.UUID;

public class PlaylistDto {
    private UUID id;
    private UUID userId;
    private String userName;
    private String name;
    private String description;
    private String coverImagePath;
    private String coverImageUrl;
    private String playlistType;
    private List<SongDto> songs;

    public PlaylistDto() {}

    public PlaylistDto(Playlist playlist) {
        this.id = playlist.getId();
        if (playlist.getUser() != null) {
            this.userId = playlist.getUser().getId();
            this.userName = playlist.getUser().getName();
        }
        this.name = playlist.getName();
        this.description = playlist.getDescription();
        this.coverImagePath = playlist.getCoverImagePath();
        this.coverImageUrl = playlist.getCoverImagePath() != null ? "/api/media/" + playlist.getCoverImagePath() : null;
        this.playlistType = playlist.getPlaylistType().name();
    }

    public PlaylistDto(Playlist playlist, List<SongDto> songs) {
        this(playlist);
        this.songs = songs;
    }

    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getCoverImagePath() { return coverImagePath; }
    public String getCoverImageUrl() { return coverImageUrl; }
    public String getPlaylistType() { return playlistType; }
    public List<SongDto> getSongs() { return songs; }
    public void setSongs(List<SongDto> songs) { this.songs = songs; }
}
