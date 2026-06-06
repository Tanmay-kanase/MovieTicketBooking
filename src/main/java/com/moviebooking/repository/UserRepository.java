package com.moviebooking.repository;

import com.moviebooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<com.moviebooking.models.User> findByEmail(String email);
}