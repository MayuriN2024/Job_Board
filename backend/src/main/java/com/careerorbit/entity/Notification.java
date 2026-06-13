package com.careerorbit.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user; // Recipient

    @Column(nullable = false)
    private String message;

    private String type; // "JOB_POSTED", "APPLICATION_STATUS"

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private boolean isRead;

    private Long jobId;
}
