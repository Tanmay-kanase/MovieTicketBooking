package com.moviebooking.service;

import com.moviebooking.exceptions.movie.InsufficientCapacityException;
import com.moviebooking.models.Booking;
import com.moviebooking.models.Movie;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.MovieRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Transactional
    public Booking createBooking(Booking booking) {

        Movie movie = movieRepository.findById(booking.getMovie().getId())
                .orElseThrow(() -> new RuntimeException("Movie not found with id: " + booking.getMovie().getId()));

        if (movie.getMaxCapacity() < booking.getNumberOfTickets()) {
            throw new InsufficientCapacityException(
                    "Booking failed. Only " + movie.getMaxCapacity() + " tickets left for this movie.");
        }

        movie.setMaxCapacity(movie.getMaxCapacity() - booking.getNumberOfTickets());
        movieRepository.save(movie);

        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(bookingDetails.getStatus());

            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found with id " + id));
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }

    public List<Booking> getBookingsByUserId(Long userId) {
        return bookingRepository.findByUserId(userId);
    }
}