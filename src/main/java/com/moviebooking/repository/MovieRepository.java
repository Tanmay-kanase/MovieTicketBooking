package com.moviebooking.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.moviebooking.models.Movie;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
}