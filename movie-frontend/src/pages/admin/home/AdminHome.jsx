import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../../config/axiosConfig";
import "./AdminHome.css";
import Navbar from "./Navbar";

const AdminHome = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axiosInstance.get("/api/movies");
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to load dashboard data");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return (
    <div className="admin-layout">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Hero / Dashboard Area */}
      <main className="admin-main-content">
        <div className="hero-section">
          <h1>Welcome to the Admin Dashboard</h1>
          <p>
            Manage your movie catalog, theaters, and user bookings from one
            place.
          </p>
        </div>

        {/* Quick Stats Summary */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Total Movies</h3>
            <p className="stat-number">{loading ? "..." : movies.length}</p>
          </div>
          <div className="stat-card">
            <h3>Active Theaters</h3>
            <p className="stat-number">--</p> {/* Will wire up later */}
          </div>
          <div className="stat-card">
            <h3>Total Bookings</h3>
            <p className="stat-number">--</p> {/* Will wire up later */}
          </div>
        </div>

        {/* Movie List Section */}
        <section className="dashboard-movie-list">
          <div className="section-header">
            <h2>Current Movie Roster</h2>
            <Link to="/add-movie" className="btn-add">
              + Add New Movie
            </Link>
          </div>

          {loading && <div className="loading">Loading movie data...</div>}
          {error && <div className="error">Error: {error}</div>}

          {!loading && !error && (
            <div className="movie-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>

                    <th>Title</th>
                    <th>Language</th>
                    <th>Showtime</th>
                    <th>Capacity Left</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((movie) => (
                    <tr key={movie.id}>
                      <td>{movie.id}</td>

                      <td>
                        <strong>{movie.title}</strong>
                      </td>
                      <td>{movie.language}</td>
                      <td>
                        {movie.movieDateTime
                          ? new Date(movie.movieDateTime).toLocaleString()
                          : "Not Scheduled"}
                      </td>
                      <td>
                        <span
                          className={`capacity-badge ${movie.maxCapacity < 20 ? "low-stock" : ""}`}
                        >
                          {movie.maxCapacity}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn-edit">Edit</button>
                          <button className="btn-delete">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {movies.length === 0 && (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No movies found in the database.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminHome;
