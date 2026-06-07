package com.moviebooking.service;

import com.moviebooking.exceptions.movie.InsufficientCapacityException;
import com.moviebooking.models.Booking;
import com.moviebooking.models.Movie;
import com.moviebooking.models.Theater;
import com.moviebooking.models.User;
import com.moviebooking.repository.BookingRepository;
import com.moviebooking.repository.MovieRepository;
import com.moviebooking.repository.TheaterRepository;
import com.moviebooking.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    private static final Logger log = LoggerFactory.getLogger(BookingService.class);

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MovieRepository movieRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TheaterRepository theaterRepository;

    @Transactional
    public Booking createBooking(Booking booking) {

        // 1. Fetch fully populated Movie and Theater
        Movie movie = movieRepository.findById(booking.getMovie().getId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        Theater theater = theaterRepository.findById(booking.getTheater().getId())
                .orElseThrow(() -> new RuntimeException("Theater not found"));

        // 2. Check Capacity
        if (movie.getMaxCapacity() < booking.getNumberOfTickets()) {
            throw new RuntimeException("Booking failed. Only " + movie.getMaxCapacity() + " tickets left.");
        }
        movie.setMaxCapacity(movie.getMaxCapacity() - booking.getNumberOfTickets());
        movieRepository.save(movie);
        booking.setMovie(movie);
        booking.setTheater(theater);
        booking.setBookingDate(LocalDateTime.now());
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);
        User user = userRepository.findById(booking.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        emailService.sendBookingConfirmation(user.getEmail(), user.getName(), savedBooking);
        log.info("Booking : {}", savedBooking);
        return savedBooking;
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