package com.haribhakthi.common.dto;

import com.haribhakthi.artist.Artist;
import java.util.UUID;

public class ArtistDto {
    private UUID id;
    private String name;
    private String profileImagePath;
    private String profileImageUrl;
    private String description;
    private long songCount;

    public ArtistDto() {}

    public ArtistDto(Artist artist) {
        this.id = artist.getId();
        this.name = artist.getName();
        this.profileImagePath = artist.getProfileImagePath();
        this.profileImageUrl = artist.getProfileImagePath() != null ? "/api/media/" + artist.getProfileImagePath() : null;
        this.description = artist.getDescription();
    }

    public ArtistDto(Artist artist, long songCount) {
        this(artist);
        this.songCount = songCount;
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getProfileImagePath() { return profileImagePath; }
    public String getProfileImageUrl() { return profileImageUrl; }
    public String getDescription() { return description; }
    public long getSongCount() { return songCount; }
    public void setSongCount(long songCount) { this.songCount = songCount; }
}
