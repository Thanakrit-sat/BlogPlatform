package blogPlatform.backend.service;

import blogPlatform.backend.dto.AuthResponse;
import blogPlatform.backend.dto.LoginRequest;
import blogPlatform.backend.dto.RegisterRequest;
import blogPlatform.backend.model.User;
import blogPlatform.backend.repository.UserRepository;
import blogPlatform.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());

        User saved = userRepository.save(user);
        String token = jwtUtil.generateToken(saved.getEmail());

        return new AuthResponse(token, saved.getId(),
                saved.getUsername(), saved.getEmail());
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return new AuthResponse(token, user.getId(),
                user.getUsername(), user.getEmail());
    }
}
