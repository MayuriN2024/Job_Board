package com.careerorbit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String company;

    private String location;
    
    private String salary; // e.g. "₹25–40 LPA"

    private Integer salaryMin;

    private Integer salaryMax;

    private String category; // e.g. "Engineering"

    private Boolean featured;

    private String applyUrl;

    private String tags; // Comma-separated tags (e.g. "React,CSS")

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String responsibilities; // Newline-separated responsibilities

    @Column(columnDefinition = "TEXT")
    private String requirements; // Newline-separated requirements

    private String experience;

    private String employmentType;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @ManyToOne
    @JoinColumn(name = "recruiter_id")
    private User recruiter;

    // Optional field to match frontend mock data's age of job posting
    private Integer postedDays;
}
