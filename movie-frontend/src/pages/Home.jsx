import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { AuthContext } from "../context/AuthContext";
import axiosInstance from "../config/axiosConfig";
import HomeNav from "./HomeNav";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // New state variables for dynamic data
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Fetch movies on component mount
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/movies");
        setMovies(response.data);
      } catch (err) {
        console.error("Error fetching movies:", err);
        setError("Failed to load movies. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  // Carousel timer
  useEffect(() => {
    if (movies.length === 0) return; // Don't run timer if no movies

    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % movies.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [movies.length]);

  return (
    <div className="home-container">
      {/* Navbar Section */}

      <HomeNav />
      {/* Handle Loading & Error States gracefully */}
      {isLoading ? (
        <div
          className="loading-spinner"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>Loading Movies...</h2>
        </div>
      ) : error ? (
        <div
          className="error-message"
          style={{ textAlign: "center", padding: "50px", color: "red" }}
        >
          <h2>{error}</h2>
        </div>
      ) : movies.length === 0 ? (
        <div
          className="no-movies"
          style={{ textAlign: "center", padding: "50px" }}
        >
          <h2>No movies currently showing.</h2>
        </div>
      ) : (
        <>
          {/* Hero / Carousel Section */}
          <header
            className="hero-carousel"
            style={{
              // Using vl_image for the carousel background as requested
              backgroundImage: `url(${movies[currentSlide]?.hr_image})`,
            }}
          >
            <div className="hero-overlay">
              <div className="hero-content">
                <span className="badge">Now Showing</span>
                <h1>{movies[currentSlide]?.title}</h1>
                <p>{movies[currentSlide]?.description}</p>
                <button
                  className="btn-primary"
                  onClick={() => {
                    navigate(`movie/${movies[currentSlide]?.id}`);
                  }}
                >
                  Book Tickets
                </button>
              </div>
            </div>

            {/* Carousel Dots */}
            <div className="carousel-dots">
              {movies.map((_, index) => (
                <span
                  key={index}
                  className={`dot ${index === currentSlide ? "active" : ""}`}
                  onClick={() => setCurrentSlide(index)}
                ></span>
              ))}
            </div>
          </header>

          {/* Movie Catalog Section */}
          <main className="movie-section">
            <div className="section-header">
              <h2>Recommended Movies</h2>
              <a href="#all" className="view-all">
                View All &rsaquo;
              </a>
            </div>

            <div className="movie-grid">
              {movies.map((movie) => (
                <div
                  className="movie-card"
                  key={movie.id}
                  onClick={() => navigate(`movie/${movie.id}`)}
                >
                  <div className="card-image-wrapper">
                    <img
                      src={movie.vl_image}
                      alt={movie.title}
                      className="movie-poster"
                      // Fallback if the image fails to load
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/300x450?text=No+Poster";
                      }}
                    />
                  </div>
                  <div className="card-body">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-info">
                      <span className="movie-genre">{movie.language}</span>
                      <span className="movie-duration">
                        {movie.durationMinutes} mins
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Home;
