package com.moviebooking.service;

import com.moviebooking.exceptions.user.InvalidCredentialsException;
import com.moviebooking.exceptions.user.UserAlreadyExistsException;
import com.moviebooking.models.User;
import com.moviebooking.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestTemplate restTemplate = new RestTemplate();

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateUser(Long id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        existingUser.setName(updatedUser.getName());
        existingUser.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null &&
                !updatedUser.getPassword().isBlank()) {
            existingUser.setPassword(updatedUser.getPassword());
        }

        return userRepository.save(existingUser);
    }

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException("Email already registered!");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole("USER");
        return userRepository.save(user);
    }

    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid Email or Password"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new InvalidCredentialsException("Invalid Email or Password");
        }
        return user;
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> verifyGoogleTokenAndProcess(String idToken) {
        String googleVerificationUrl = "https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken;
        try {
            Map<String, Object> response = restTemplate.getForObject(googleVerificationUrl, Map.class);
            if (response == null || response.containsKey("error_description")) {
                throw new InvalidCredentialsException("Invalid Google Token");
            }

            String email = (String) response.get("email");
            String name = (String) response.get("name");

            Optional<User> existingUser = userRepository.findByEmail(email);

            if (existingUser.isPresent()) {
                return Map.of("isNewUser", false, "user", existingUser.get());
            } else {
                return Map.of("isNewUser", true, "email", email, "name", name);
            }
        } catch (Exception e) {
            throw new InvalidCredentialsException("Google authentication failed");
        }
    }
}