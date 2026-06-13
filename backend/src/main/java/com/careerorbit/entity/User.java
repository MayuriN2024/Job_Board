package com.careerorbit.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String location;
    
    private String title;

    private String bio;

    @Column(columnDefinition = "TEXT")
    private String profilePic;

    private String resumeName;

    @Column(columnDefinition = "TEXT")
    private String resumeData;

    private String skills; // Stored as comma-separated string (e.g. "Java,React,SQL")

    public enum Role {
        ROLE_USER,
        ROLE_RECRUITER
    }
}
