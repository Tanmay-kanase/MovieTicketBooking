package com.moviebooking.models;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Movies")
@Data
public class Movie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String title;
    private String description;
    private String language;
    private String hr_image;
    private String vl_image;
    private int durationMinutes;
    private double price;
    private LocalDateTime movieDateTime;
    private int maxCapacity;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "theater_id")
    private Theater theater;
}