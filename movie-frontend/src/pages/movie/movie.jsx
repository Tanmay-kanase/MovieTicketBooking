import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./movie.css";
// Adjust this path if your axiosConfig is in a different location
import axiosInstance from "../../config/axiosConfig";
import HomeNav from "../HomeNav";

const Movie = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const handleBookTicket = () => {
    navigate(`/book/${movie.id}`);
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
              // Updated to use hr_image as requested
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
                <span className="detail-label">Tickets Available:</span>
                <span
                  className={`detail-value ${movie.maxCapacity <= 0 ? "sold-out-text" : ""}`}
                >
                  {movie.maxCapacity > 0 ? movie.maxCapacity : "Sold Out"}
                </span>
              </div>
            </div>

            <button
              className="book-btn"
              onClick={handleBookTicket}
              disabled={movie.maxCapacity <= 0}
            >
              {movie.maxCapacity > 0 ? "Book Tickets Now" : "Sold Out"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Movie;
