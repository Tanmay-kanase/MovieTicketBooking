import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./myTickets.css";
import HomeNav from "../HomeNav";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosConfig";
import jsPDF from "jspdf";
const MyTickets = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const downloadTicketPDF = async (ticket) => {
    console.log("Ticket Data:", ticket);
    try {
      setDownloadingId(ticket.id);

      const pdf = new jsPDF("landscape", "mm", [80, 180]);

      // Ticket dimensions
      const width = 180;
      const height = 80;

      // Outer border
      pdf.setDrawColor(0);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(5, 5, width - 10, height - 10, 3, 3);

      // Header background
      pdf.setFillColor(30, 41, 59);
      pdf.rect(5, 5, width - 10, 15, "F");

      // App Name
      pdf.setTextColor(255, 255, 255);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("TicketHub", 10, 15);

      // Movie Title
      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(18);
      pdf.text(ticket.movie?.title || "Movie Title", 10, 32);

      // Divider
      pdf.setDrawColor(150);
      pdf.line(10, 36, 170, 36);

      // Left section
      pdf.setFontSize(10);
      pdf.setFont("helvetica", "bold");
      pdf.text("THEATER", 10, 45);

      pdf.setFont("helvetica", "normal");
      pdf.text(ticket.theater?.name || "-", 10, 50);

      pdf.setFont("helvetica", "bold");
      pdf.text("LOCATION", 10, 58);

      pdf.setFont("helvetica", "normal");
      pdf.text(ticket.theater?.location || "-", 10, 63);

      // Center section
      pdf.setFont("helvetica", "bold");
      pdf.text("SHOW DATE", 75, 45);

      pdf.setFont("helvetica", "normal");
      pdf.text(
        ticket.movie?.movieDateTime
          ? new Date(ticket.movie.movieDateTime).toLocaleDateString()
          : "-",
        75,
        50,
      );

      pdf.setFont("helvetica", "bold");
      pdf.text("TIME", 75, 58);

      pdf.setFont("helvetica", "normal");
      pdf.text(
        ticket.movie?.movieDateTime
          ? new Date(ticket.movie.movieDateTime).toLocaleTimeString()
          : "-",
        75,
        63,
      );

      // Right section
      pdf.setFont("helvetica", "bold");
      pdf.text("SEATS", 130, 45);

      pdf.setFont("helvetica", "normal");
      pdf.text(`${ticket.numberOfTickets}`, 130, 50);

      pdf.setFont("helvetica", "bold");
      pdf.text("BOOKING ID", 130, 58);

      pdf.setFont("helvetica", "normal");
      pdf.text(`#${ticket.id}`, 130, 63);

      // Fake barcode
      let x = 115;
      for (let i = 0; i < 40; i++) {
        // eslint-disable-next-line react-hooks/purity
        const barHeight = 12 + Math.random() * 8;
        pdf.line(x, 68, x, 68 - barHeight);
        x += 1.2;
      }

      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        "Please carry a valid ID. Entry subject to theater rules.",
        10,
        73,
      );

      pdf.save(`TicketHub_${ticket.movie?.title || "Movie"}_${ticket.id}.pdf`);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloadingId(null);
    }
  };
  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      navigate("/signin");
      return;
    }

    const fetchMyTickets = async () => {
      try {
        setLoading(true);
        // Calls the new endpoint we just added to the backend
        const response = await axiosInstance.get(
          `/api/bookings/user/${user.id}`,
        );

        // Sort tickets so the most recently booked are at the top
        const sortedTickets = response.data.sort(
          (a, b) => new Date(b.bookingDate) - new Date(a.bookingDate),
        );

        setTickets(sortedTickets);
      } catch (err) {
        console.error("Error fetching tickets:", err);
        setError("Failed to load your tickets. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyTickets();
  }, [user, navigate]);

  if (loading)
    return (
      <>
        <HomeNav />
        <div className="status-container">
          <h2>Loading your tickets...</h2>
        </div>
      </>
    );

  if (error)
    return (
      <>
        <HomeNav />
        <div className="status-container">
          <h2 className="error-text">{error}</h2>
        </div>
      </>
    );

  return (
    <div className="my-tickets-page">
      <HomeNav />

      <div className="tickets-wrapper">
        <div className="tickets-header">
          <h1>My Tickets</h1>
          <p>View and manage your upcoming and past movie bookings.</p>
        </div>

        {tickets.length === 0 ? (
          <div className="no-tickets">
            <img
              src="https://via.placeholder.com/150?text=No+Tickets"
              alt="No tickets"
            />
            <h2>No Bookings Found</h2>
            <p>Looks like you haven't booked any movies yet.</p>
            <button className="browse-btn" onClick={() => navigate("/")}>
              Browse Movies
            </button>
          </div>
        ) : (
          <div className="tickets-list">
            {tickets.map((ticket) => (
              <div
                className="ticket-card"
                key={ticket.id}
                id={`ticket-${ticket.id}`}
              >
                <div className="ticket-image-wrapper">
                  <img
                    src={
                      ticket.movie?.hr_image ||
                      "https://via.placeholder.com/200x300?text=Movie"
                    }
                    alt={ticket.movie?.title}
                    className="ticket-movie-img"
                  />
                </div>

                <div className="ticket-details">
                  <div className="ticket-main-info">
                    <h2>{ticket.movie?.title}</h2>
                    <span
                      className={`status-badge ${ticket.status?.toLowerCase() || "confirmed"}`}
                    >
                      {ticket.status || "Confirmed"}
                    </span>
                    <button
                      className="download-btn-hide-in-pdf"
                      onClick={() => downloadTicketPDF(ticket)}
                      disabled={downloadingId === ticket.id}
                      style={{
                        backgroundColor:
                          downloadingId === ticket.id ? "#94a3b8" : "#334155",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "bold",
                        cursor:
                          downloadingId === ticket.id
                            ? "not-allowed"
                            : "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {downloadingId === ticket.id
                        ? " Generating..."
                        : "↓ Download PDF"}
                    </button>
                  </div>

                  <div className="ticket-info-grid">
                    <div className="info-group">
                      <span className="info-label">Theater</span>
                      <span className="info-value">{ticket.theater?.name}</span>
                      <span className="info-sub-value">
                        {ticket.theater?.location}
                      </span>
                    </div>

                    <div className="info-group">
                      <span className="info-label">Showtime</span>
                      <span className="info-value">
                        {ticket.movie?.movieDateTime
                          ? new Date(
                              ticket.movie.movieDateTime,
                            ).toLocaleDateString(undefined, {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })
                          : "N/A"}
                      </span>
                      <span className="info-sub-value">
                        {ticket.movie?.movieDateTime
                          ? new Date(
                              ticket.movie.movieDateTime,
                            ).toLocaleTimeString(undefined, {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>

                    <div className="info-group">
                      <span className="info-label">Tickets</span>
                      <span className="info-value">
                        {ticket.numberOfTickets} Seat(s)
                      </span>
                      <span className="info-sub-value">
                        Booking ID: #{ticket.id}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTickets;
