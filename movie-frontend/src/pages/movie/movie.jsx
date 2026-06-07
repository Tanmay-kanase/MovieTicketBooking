import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./movie.css";
import axiosInstance from "../../config/axiosConfig";
import HomeNav from "../HomeNav";
import { AuthContext } from "../../context/AuthContext";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [numberOfTickets, setNumberOfTickets] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/movies/${id}`);
        setMovie(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Movie not found");
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  // Helper function to load Razorpay Checkout Script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePaymentAndBooking = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in to book tickets.");
      navigate("/signin");
      return;
    }

    setIsProcessing(true);

    // 1. Load Razorpay SDK
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert(
        "Razorpay SDK failed to load. Please check your internet connection.",
      );
      setIsProcessing(false);
      return;
    }

    const totalAmount = movie.price * numberOfTickets;

    // Handle edge case if movie price is set to 0 (Free screening)
    if (totalAmount <= 0) {
      await finalizeBooking();
      return;
    }

    // 2. Configure Razorpay Options
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY, // Replace with your actual Razorpay Key ID
      amount: totalAmount * 100, // Amount in paise (e.g., ₹250 = 25000 paise)
      currency: "INR",
      name: "TicketHub",
      description: `Booking for ${movie.title} - ${numberOfTickets} Ticket(s)`,
      image: movie.hr_image || "",
      handler: async function () {
        await finalizeBooking();
      },
      prefill: {
        name: user?.name || "",
        email: user?.email || "",
      },
      theme: {
        color: "#dc2626", // TicketHub branding color
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        },
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // 3. Post Booking Payload to Backend after Payment Confirmation
  const finalizeBooking = async () => {
    try {
      const bookingPayload = {
        userId: user?.id || 1, // Fallback to 1 if testing without custom context IDs
        movie: {
          id: movie.id,
        },
        theater: {
          id: movie.theater?.id,
        },
        numberOfTickets: parseInt(numberOfTickets),
      };

      await axiosInstance.post("/api/bookings", bookingPayload);
      navigate("/my-tickets"); // Redirect to My Tickets view
    } catch (err) {
      console.error("Booking API error:", err);
      alert(
        "Payment was successful, but booking generation failed. Please contact support.",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return <div className="status-message">Loading details...</div>;
  if (error)
    return <div className="status-message error-text">Error: {error}</div>;
  if (!movie) return null;

  return (
    <>
      <HomeNav />
      <div className="movie-detail-wrapper">
        <div className="movie-detail-card">
          <div className="movie-image-section">
            <img
              src={
                movie.hr_image ||
                "https://via.placeholder.com/400x600?text=No+Image"
              }
              alt={movie.title}
              className="movie-poster"
            />
          </div>

          <div className="movie-info-section">
            <h1 className="movie-title">{movie.title}</h1>

            <div className="movie-tags">
              <span className="tag">{movie.language}</span>
              <span className="tag">{movie.durationMinutes} mins</span>
            </div>

            <p className="movie-description">{movie.description}</p>

            <div className="movie-details-list">
              <div className="detail-item">
                <span className="detail-label">Showtime:</span>
                <span className="detail-value">
                  {new Date(movie.movieDateTime).toLocaleString(undefined, {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Theater:</span>
                <span className="detail-value">
                  {movie.theater?.name} ({movie.theater?.location})
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Price per Ticket:</span>
                <span className="detail-value price-text">
                  {movie.price > 0 ? `₹${movie.price}` : "Free"}
                </span>
              </div>

              <div className="detail-item">
                <span className="detail-label">Tickets Available:</span>
                <span
                  className={`detail-value ${movie.maxCapacity <= 0 ? "sold-out-text" : ""}`}
                >
                  {movie.maxCapacity > 0 ? movie.maxCapacity : "Sold Out"}
                </span>
              </div>
            </div>

            {/* Conditional Sub-View: Ticket Quantity Selector & Checkout */}
            {showBookingForm ? (
              <form
                onSubmit={handlePaymentAndBooking}
                className="booking-form-inline"
              >
                <div className="ticket-qty-selector">
                  <label htmlFor="ticketCount">Select Tickets:</label>
                  <input
                    id="ticketCount"
                    type="number"
                    min="1"
                    max={Math.min(movie.maxCapacity, 10)} // Restrict to max availability or 10 per order
                    value={numberOfTickets}
                    onChange={(e) => setNumberOfTickets(e.target.value)}
                    required
                  />
                </div>

                <div className="total-breakdown">
                  <span>Total Amount:</span>
                  <strong>₹{movie.price * numberOfTickets}</strong>
                </div>

                <div className="booking-action-row">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowBookingForm(false)}
                    disabled={isProcessing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="book-btn"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Proceed to Pay"}
                  </button>
                </div>
              </form>
            ) : (
              <button
                className="book-btn"
                onClick={() => setShowBookingForm(true)}
                disabled={movie.maxCapacity <= 0}
              >
                {movie.maxCapacity > 0 ? "Book Tickets Now" : "Sold Out"}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Movie;
