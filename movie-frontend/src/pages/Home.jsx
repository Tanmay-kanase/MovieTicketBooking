import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const featuredMovies = [
    {
      id: 101,
      title: "Inception",
      description:
        "A thief who steals corporate secrets through the use of dream-sharing technology.",
      imageUrl:
        "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 102,
      title: "Avengers: Endgame",
      description:
        "After the devastating events of Infinity War, the universe is in ruins. The Avengers assemble once more.",
      imageUrl:
        "https://images.unsplash.com/photo-1293314044199-73d82a7f0556?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 103,
      title: "John Wick: Chapter 4",
      description:
        "John Wick uncovers a path to defeating The High Table, but first he must face a new enemy.",
      imageUrl:
        "https://images.unsplash.com/photo-1574267432553-4b462808152a?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  const movieCatalog = [
    {
      id: 1,
      title: "The Dark Knight",
      genre: "Action",
      rating: "9.0",
      poster:
        "https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 2,
      title: "Interstellar",
      genre: "Sci-Fi",
      rating: "8.6",
      poster:
        "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 3,
      title: "Dune: Part Two",
      genre: "Sci-Fi",
      rating: "8.8",
      poster:
        "https://images.unsplash.com/photo-1542204165-65bf26472b9b?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 4,
      title: "Oppenheimer",
      genre: "Drama",
      rating: "8.4",
      poster:
        "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featuredMovies.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [featuredMovies.length]);

  return (
    <div className="home-container">
      {/* Navbar Section */}
      <nav className="navbar">
        <div
          className="nav-brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          <span className="logo-text">
            Ticket<span className="text-red">Hub</span>
          </span>
        </div>

        <div className="nav-search">{/* Search Inputs... */}</div>

        <div className="nav-actions">
          {/* CONDITIONAL RENDERING STARTS HERE */}
          {user ? (
            // WHAT THE LOGGED-IN USER SEES
            <div className="user-menu">
              <button
                className="nav-link-btn"
                onClick={() => navigate("/my-tickets")}
              >
                My Tickets
              </button>
              <button
                className="nav-link-btn"
                onClick={() => navigate("/payments")}
              >
                Payments
              </button>

              <div className="profile-dropdown">
                <button className="profile-btn">
                  {/* Display the first letter of their name */}
                  <div className="avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span>{user.name}</span>
                </button>

                {/* A simple CSS-based dropdown menu */}
                <div className="dropdown-content">
                  <button onClick={() => navigate("/profile")}>
                    My Profile
                  </button>
                  <button onClick={logout} className="text-red">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              className="btn-outline"
              onClick={() => {
                navigate("/signin");
              }}
            >
              Sign In
            </button>
          )}
          {/* CONDITIONAL RENDERING ENDS HERE */}
        </div>
      </nav>

      {/* Hero / Carousel Section */}
      <header
        className="hero-carousel"
        style={{
          backgroundImage: `url(${featuredMovies[currentSlide].imageUrl})`,
        }}
      >
        <div className="hero-overlay">
          <div className="hero-content">
            <span className="badge">Now Showing</span>
            <h1>{featuredMovies[currentSlide].title}</h1>
            <p>{featuredMovies[currentSlide].description}</p>
            <button className="btn-primary">Book Tickets</button>
          </div>
        </div>

        {/* Carousel Dots */}
        <div className="carousel-dots">
          {featuredMovies.map((_, index) => (
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
          {movieCatalog.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <div className="card-image-wrapper">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="movie-poster"
                />
              </div>
              <div className="card-body">
                <h3 className="movie-title">{movie.title}</h3>
                <div className="movie-info">
                  <span className="movie-genre">{movie.genre}</span>
                  <span className="movie-rating">★ {movie.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
