package com.careerorbit.service;

import com.careerorbit.dto.AuthResponse;
import com.careerorbit.dto.LoginRequest;
import com.careerorbit.dto.RegisterRequest;
import com.careerorbit.entity.User;
import com.careerorbit.repository.UserRepository;
import com.careerorbit.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        if (repository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String defaultTitle = request.getRole() == User.Role.ROLE_RECRUITER ? "Recruiter" : "Job Seeker";

        var user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : User.Role.ROLE_USER)
                .location(request.getLocation() != null ? request.getLocation() : "")
                .title(defaultTitle)
                .bio("")
                .profilePic("")
                .resumeName("")
                .resumeData("")
                .skills("") // Empty comma-separated skills
                .build();
        
        repository.save(user);
        
        var jwtToken = jwtService.generateToken(org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name().replace("ROLE_", ""))
                .build());
                
        return AuthResponse.builder()
                .token(jwtToken)
                .message("User registered successfully")
                .user(user)
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        var jwtToken = jwtService.generateToken(org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPassword())
                .roles(user.getRole().name().replace("ROLE_", ""))
                .build());
                
        return AuthResponse.builder()
                .token(jwtToken)
                .message("Login successful")
                .user(user)
                .build();
    }
}
