package com.example.demo.entity;

import com.example.demo.enums.UserRole;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "system_users")
public class SystemUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Column(unique = true, nullable = false)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UserRole role;

    private boolean isActive = true;

    public SystemUser() {}

    public SystemUser(Long id, String username, String password, String email, UserRole role, boolean isActive) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.email = email;
        this.role = role;
        this.isActive = isActive;
    }

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String username;
        private String password;
        private String email;
        private UserRole role;
        private boolean isActive = true;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder username(String username) { this.username = username; return this; }
        public Builder password(String password) { this.password = password; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder role(UserRole role) { this.role = role; return this; }
        public Builder isActive(boolean isActive) { this.isActive = isActive; return this; }
        public SystemUser build() { return new SystemUser(id, username, password, email, role, isActive); }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { this.isActive = active; }
}
