package com.moviebooking.service;

import com.moviebooking.models.Booking;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendBookingConfirmation(String toEmail, String userName, Booking booking) {
        log.info("Booking {}", booking);
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(toEmail);
            helper.setSubject("TicketHub: Booking Confirmed - " + booking.getMovie().getTitle());

            // Format the date nicely
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("EEEE, MMM dd, yyyy 'at' hh:mm a");
            String showTime = booking.getMovie().getMovieDateTime() != null
                    ? booking.getMovie().getMovieDateTime().format(formatter)
                    : "TBD";

            // HTML Email Template
            String htmlContent = """
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <style>
                            body { font-family: Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 20px; }
                            .container { max-width: 600px; margin: auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
                            .header { background-color: #dc2626; color: white; text-align: center; padding: 20px; }
                            .header h1 { margin: 0; font-size: 24px; }
                            .content { padding: 30px; color: #333333; }
                            .ticket-box { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 20px; margin-top: 20px; }
                            .detail-row { display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 5px; }
                            .detail-label { color: #64748b; font-weight: bold; font-size: 14px;}
                            .detail-value { color: #0f172a; font-weight: bold; font-size: 16px;}
                            .footer { text-align: center; padding: 20px; font-size: 12px; color: #94a3b8; }
                            .btn { display: inline-block; background: #dc2626; color: white; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 20px;}
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>🎟️ Booking Confirmed!</h1>
                            </div>
                            <div class="content">
                                <p>Hi %s,</p>
                                <p>Your tickets have been successfully booked! Get ready for an amazing cinematic experience.</p>

                                <div class="ticket-box">
                                    <div class="detail-row">
                                        <span class="detail-label">Movie:</span>
                                        <span class="detail-value">%s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Theater:</span>
                                        <span class="detail-value">%s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Showtime:</span>
                                        <span class="detail-value">%s</span>
                                    </div>
                                    <div class="detail-row">
                                        <span class="detail-label">Tickets:</span>
                                        <span class="detail-value">%d Seat(s)</span>
                                    </div>
                                    <div class="detail-row" style="border-bottom: none;">
                                        <span class="detail-label">Booking ID:</span>
                                        <span class="detail-value">#%d</span>
                                    </div>
                                </div>

                                <center>
                                    <a href="http://localhost:3000/my-tickets" class="btn">View My Tickets</a>
                                </center>
                            </div>
                            <div class="footer">
                                <p>Thank you for choosing TicketHub.</p>
                                <p>Need help? Reply to this email or visit our support center.</p>
                            </div>
                        </div>
                    </body>
                    </html>
                    """
                    .formatted(
                            userName,
                            booking.getMovie().getTitle(),
                            booking.getTheater().getName() + " (" + booking.getTheater().getLocation() + ")",
                            showTime,
                            booking.getNumberOfTickets(),
                            booking.getId());

            helper.setText(htmlContent, true); // Set true for HTML
            mailSender.send(message);

        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
        }
    }
}