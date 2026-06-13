package com.careerorbit.controller;

import com.careerorbit.entity.User;
import com.careerorbit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody User profileUpdates) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return userRepository.findByEmail(userDetails.getUsername())
                .map(user -> {
                    if (profileUpdates.getName() != null) user.setName(profileUpdates.getName());
                    if (profileUpdates.getLocation() != null) user.setLocation(profileUpdates.getLocation());
                    if (profileUpdates.getTitle() != null) user.setTitle(profileUpdates.getTitle());
                    if (profileUpdates.getBio() != null) user.setBio(profileUpdates.getBio());
                    if (profileUpdates.getProfilePic() != null) user.setProfilePic(profileUpdates.getProfilePic());
                    if (profileUpdates.getResumeName() != null) user.setResumeName(profileUpdates.getResumeName());
                    if (profileUpdates.getResumeData() != null) user.setResumeData(profileUpdates.getResumeData());
                    if (profileUpdates.getSkills() != null) user.setSkills(profileUpdates.getSkills());
                    return ResponseEntity.ok(userRepository.save(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
