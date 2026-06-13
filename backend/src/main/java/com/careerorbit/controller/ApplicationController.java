package com.careerorbit.controller;

import com.careerorbit.entity.Application;
import com.careerorbit.entity.Job;
import com.careerorbit.entity.Notification;
import com.careerorbit.entity.User;
import com.careerorbit.repository.ApplicationRepository;
import com.careerorbit.repository.JobRepository;
import com.careerorbit.repository.NotificationRepository;
import com.careerorbit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @PostMapping("/apply/{jobId}")
    public ResponseEntity<?> applyToJob(@PathVariable Long jobId, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User seeker = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (applicationRepository.findByUserAndJob(seeker, job).isPresent()) {
            return ResponseEntity.badRequest().body("Already applied to this job");
        }

        Application application = Application.builder()
                .user(seeker)
                .job(job)
                .status("Applied")
                .build();
        
        Application savedApplication = applicationRepository.save(application);

        // Notify recruiter if recruiter is present
        if (job.getRecruiter() != null) {
            notificationRepository.save(Notification.builder()
                    .user(job.getRecruiter())
                    .message("New Application: " + seeker.getName() + " applied for " + job.getTitle())
                    .type("APPLICATION_SUBMITTED")
                    .jobId(job.getId())
                    .isRead(false)
                    .build());
        }

        return ResponseEntity.ok(savedApplication);
    }

    @GetMapping
    public ResponseEntity<List<Application>> getApplications(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User seeker = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(applicationRepository.findByUserOrderByAppliedAtDesc(seeker));
    }

    @GetMapping("/recruiter")
    public ResponseEntity<List<Application>> getRecruiterApplications(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User recruiter = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (recruiter.getRole() != User.Role.ROLE_RECRUITER) {
            return ResponseEntity.status(403).build();
        }
        
        return ResponseEntity.ok(applicationRepository.findByJobRecruiterOrderByAppliedAtDesc(recruiter));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateApplicationStatus(
            @PathVariable Long id, 
            @RequestBody Map<String, String> body, 
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Status is required");
        }

        User recruiter = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Application application = applicationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Verify the logged-in user is indeed the recruiter for this job
        if (application.getJob().getRecruiter() == null || 
            !application.getJob().getRecruiter().getId().equals(recruiter.getId())) {
            return ResponseEntity.status(403).body("Forbidden: You are not the recruiter for this vacancy");
        }

        application.setStatus(newStatus);
        Application updatedApplication = applicationRepository.save(application);

        // Notify seeker about the status change
        notificationRepository.save(Notification.builder()
                .user(application.getUser())
                .message("Application Status Update: Your application for '" + application.getJob().getTitle() + 
                         "' is now '" + newStatus + "'")
                .type("APPLICATION_STATUS")
                .jobId(application.getJob().getId())
                .isRead(false)
                .build());

        return ResponseEntity.ok(updatedApplication);
    }
}
