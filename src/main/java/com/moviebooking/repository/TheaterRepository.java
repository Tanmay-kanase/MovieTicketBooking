package com.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviebooking.models.Theater;

@Repository
public interface TheaterRepository extends JpaRepository<Theater, Long> {
}
