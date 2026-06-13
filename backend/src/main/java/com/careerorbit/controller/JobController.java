package com.careerorbit.controller;

import com.careerorbit.entity.Job;
import com.careerorbit.entity.Notification;
import com.careerorbit.entity.User;
import com.careerorbit.repository.NotificationRepository;
import com.careerorbit.repository.UserRepository;
import com.careerorbit.service.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
public class JobController {

    private final JobService service;
    private final UserRepository userRepository;
    private final NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(service.getAllJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return service.getJobById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createJob(@RequestBody Job job, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in first.");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getRole() != User.Role.ROLE_RECRUITER) {
            return ResponseEntity.status(403).body("Forbidden: Only recruiters can add jobs.");
        }
        job.setRecruiter(user);
        Job createdJob = service.createJob(job);

        // Notify all job seekers
        List<User> seekers = userRepository.findAllByRole(User.Role.ROLE_USER);
        for (User seeker : seekers) {
            notificationRepository.save(Notification.builder()
                    .user(seeker)
                    .message("New Job Posted: " + createdJob.getTitle() + " at " + createdJob.getCompany())
                    .type("JOB_POSTED")
                    .jobId(createdJob.getId())
                    .isRead(false)
                    .build());
        }

        return ResponseEntity.ok(createdJob);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateJob(@PathVariable Long id, @RequestBody Job job, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in first.");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job existingJob = service.getJobById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (existingJob.getRecruiter() != null && !existingJob.getRecruiter().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Forbidden: You can only update jobs you posted.");
        }
        
        return ResponseEntity.ok(service.updateJob(id, job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized: Please log in first.");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job existingJob = service.getJobById(id)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (existingJob.getRecruiter() != null && !existingJob.getRecruiter().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Forbidden: You can only delete jobs you posted.");
        }
        
        service.deleteJob(id);
        return ResponseEntity.noContent().build();
    }
}
