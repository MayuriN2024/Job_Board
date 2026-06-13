package com.careerorbit.controller;

import com.careerorbit.entity.Job;
import com.careerorbit.entity.SavedJob;
import com.careerorbit.entity.User;
import com.careerorbit.repository.JobRepository;
import com.careerorbit.repository.SavedJobRepository;
import com.careerorbit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
public class SavedJobController {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;

    @PostMapping("/toggle/{jobId}")
    public ResponseEntity<?> toggleSavedJob(@PathVariable Long jobId, @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Optional<SavedJob> savedJobOpt = savedJobRepository.findByUserAndJob(user, job);
        if (savedJobOpt.isPresent()) {
            savedJobRepository.delete(savedJobOpt.get());
            return ResponseEntity.ok(false); // No longer saved
        } else {
            savedJobRepository.save(SavedJob.builder().user(user).job(job).build());
            return ResponseEntity.ok(true); // Now saved
        }
    }

    @GetMapping
    public ResponseEntity<List<Job>> getSavedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<SavedJob> savedJobs = savedJobRepository.findByUser(user);
        List<Job> jobs = savedJobs.stream()
                .map(SavedJob::getJob)
                .collect(Collectors.toList());
        return ResponseEntity.ok(jobs);
    }
}
