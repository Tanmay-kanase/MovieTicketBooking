package com.moviebooking.controller;

import com.moviebooking.models.User;
import com.moviebooking.service.UserService;
import com.moviebooking.util.JwtUtils;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final JwtUtils jwtUtils;

    public UserController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

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
}