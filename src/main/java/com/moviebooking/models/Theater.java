package com.moviebooking.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Theaters")
@Data
public class Theater {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String location;
    private int totalCapacity;
    @OneToMany(mappedBy = "theater", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Movie> movies;

}