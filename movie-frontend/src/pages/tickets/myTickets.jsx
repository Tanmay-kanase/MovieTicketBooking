import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./myTickets.css";
import HomeNav from "../HomeNav";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosConfig";

const MyTickets = () => {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              <div className="ticket-card" key={ticket.id}>
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
