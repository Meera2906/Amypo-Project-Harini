package com.example.demo.dto;

import com.example.demo.enums.UserRole;

public class AuthResponseDto {
    private String token;
    private String username;
    private UserRole role;

    public AuthResponseDto() {}

    public AuthResponseDto(String token, String username, UserRole role) {
        this.token = token;
        this.username = username;
        this.role = role;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private String token;
        private String username;
        private UserRole role;

        public Builder token(String token) { this.token = token; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder role(UserRole role) { this.role = role; return this; }
        public AuthResponseDto build() { return new AuthResponseDto(token, username, role); }
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}
