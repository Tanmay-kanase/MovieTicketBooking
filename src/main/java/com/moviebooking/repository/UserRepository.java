package com.moviebooking.repository;

import com.moviebooking.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<com.moviebooking.models.User> findByEmail(String email);

    Optional<com.moviebooking.models.User> findById(Long id);

}