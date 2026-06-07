package com.moviebooking.controller;

import com.moviebooking.models.User;
import com.moviebooking.service.UserService;
import com.moviebooking.util.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtils jwtUtils;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user, HttpServletResponse response) {
        User savedUser = userService.registerUser(user);
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(savedUser.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(Map.of("message", "User registered successfully", "user", savedUser));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> credentials, HttpServletResponse response) {
        User user = userService.authenticateUser(credentials.get("email"), credentials.get("password"));
        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getEmail());

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                .body(Map.of("message", "Login successful", "user", user));
    }

    @PostMapping("/google-login")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> request, HttpServletResponse response) {
        String idToken = request.get("token");
        Map<String, Object> result = userService.verifyGoogleTokenAndProcess(idToken);

        boolean isNewUser = (boolean) result.get("isNewUser");

        if (isNewUser) {
            // Do not issue a cookie yet, return metadata so React prompts for a password
            // setup
            return ResponseEntity.status(HttpStatus.ACCEPTED).body(result);
        } else {
            User user = (User) result.get("user");
            ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(user.getEmail());
            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, jwtCookie.toString())
                    .body(Map.of("isNewUser", false, "user", user));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        ResponseCookie cleanCookie = ResponseCookie.from("movie_auth_token", "") // <-- Check your cookie name
                .path("/")
                .httpOnly(true)
                .maxAge(0)
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cleanCookie.toString())
                .body(Map.of("message", "You've been successfully logged out"));
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        User user = userService.updateUser(id, updatedUser);

        return ResponseEntity.ok(
                Map.of(
                        "message", "User updated successfully",
                        "user", user));
    }
}
