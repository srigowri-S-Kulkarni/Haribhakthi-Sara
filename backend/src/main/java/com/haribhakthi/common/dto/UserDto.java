package com.haribhakthi.common.dto;

import com.haribhakthi.user.User;
import java.util.UUID;

public class UserDto {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private String preferredLanguage;

    public UserDto() {}

    public UserDto(User user) {
        this.id = user.getId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().name();
        this.preferredLanguage = user.getPreferredLanguage();
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public String getPreferredLanguage() { return preferredLanguage; }
}
