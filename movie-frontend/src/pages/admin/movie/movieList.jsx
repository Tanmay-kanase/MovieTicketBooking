import { useState, useEffect } from "react";
import "./movieList.css";
import axiosInstance from "../../../config/axiosConfig";
import Navbar from "../home/Navbar";

const MovieList = () => {
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
        setError(err.message || "Something went wrong");
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <div className="loading">Loading movies...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <>
      <Navbar />
      <div className="admin-movie-container">
        <h2>Admin Dashboard: Movie List</h2>
        <div className="movie-list-wrapper">
          {movies.map((movie) => (
            <div className="movie-horizontal-card" key={movie.id}>
              <img
                src={
                  movie.image ||
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfzDft9vqXEDjp9cNpHt_0RXT1KI3dV4kTiwtUlKFWbw&s"
                }
                alt={movie.title}
                className="movie-image-left"
              />

              <div className="movie-info-right">
                <div className="movie-details-text">
                  <h3>{movie.title}</h3>
                  <p>
                    <strong>Language:</strong> {movie.language}
                  </p>
                  <p>
                    <strong>Theater:</strong>{" "}
                    {movie.theater ? movie.theater.name : "N/A"}
                  </p>
                  <p>
                    <strong>Showtime:</strong>{" "}
                    {new Date(movie.movieDateTime).toLocaleString()}
                  </p>
                  <p>
                    <strong>Duration:</strong> {movie.durationMinutes} mins
                  </p>
                  <p>
                    <strong>Capacity Left:</strong> {movie.maxCapacity}
                  </p>
                </div>

                <div className="admin-actions">
                  <button className="btn edit-btn">Edit</button>
                  <button className="btn delete-btn">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MovieList;
