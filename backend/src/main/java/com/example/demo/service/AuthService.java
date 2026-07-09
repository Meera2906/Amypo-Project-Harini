package com.example.demo.service;

import com.example.demo.dto.AuthRequestDto;
import com.example.demo.dto.AuthResponseDto;
import com.example.demo.dto.RegisterDto;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.BusinessValidationException;
import com.example.demo.repository.SystemUserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final SystemUserRepository userRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(SystemUserRepository userRepository, JwtService jwtService, BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtService = jwtService;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponseDto authenticate(AuthRequestDto dto) {
        SystemUser user = userRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new BusinessValidationException("User not found"));
        if (!user.isActive()) {
            throw new BusinessValidationException("Account has been revoked");
        }
        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            throw new BusinessValidationException("Invalid credentials");
        }
        String token = jwtService.generateToken(user.getUsername(), user.getRole().name());
        return AuthResponseDto.builder()
                .token(token)
                .username(user.getUsername())
                .role(user.getRole())
                .build();
    }

    public String register(RegisterDto dto) {
        SystemUser user = SystemUser.builder()
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .role(dto.getRole())
                .build();
        userRepository.save(user);
        return "User registered successfully";
    }
}
