import { useState, useEffect } from "react";
import axiosInstance from "../../config/axiosConfig";
import Navbar from "./home/Navbar";

const AddMovies = () => {
  const [movies, setMovies] = useState([]);
  const [theaters, setTheaters] = useState([]);

  const initialFormState = {
    title: "",
    description: "",
    language: "",
    hr_image: "",
    vl_image: "",
    price: "",
    durationMinutes: "",
    movieDateTime: "",
    maxCapacity: "",
    theaterId: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // Fetch initial data on component mount
  useEffect(() => {
    fetchMovies();
    fetchTheaters();
  }, []);

  const fetchMovies = async () => {
    try {
      const response = await axiosInstance.get(`api/movies`);
      setMovies(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  const fetchTheaters = async () => {
    try {
      const response = await axiosInstance.get(`api/theaters`);
      setTheaters(response.data);
    } catch (error) {
      console.error("Error fetching theaters:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "theaterId") {
      const selectedTheater = theaters.find((t) => t.id === Number(value));

      setFormData({
        ...formData,
        theaterId: value,
        maxCapacity: selectedTheater?.totalCapacity || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format payload to match Spring Boot Entity mapping
    const payload = {
      title: formData.title,
      description: formData.description,
      language: formData.language,
      hr_image: formData.hr_image,
      vl_image: formData.vl_image,
      price: formData.price,
      durationMinutes: parseInt(formData.durationMinutes),
      movieDateTime: formData.movieDateTime,
      maxCapacity: parseInt(formData.maxCapacity),
      theater: formData.theaterId ? { id: parseInt(formData.theaterId) } : null,
    };

    try {
      if (editingId) {
        // Update existing movie
        await axiosInstance.put(`api/movies/${editingId}`, payload);
        alert("Movie updated successfully!");
      } else {
        // Create new movie
        await axiosInstance.post(`api/movies`, payload);
        alert("Movie added successfully!");
      }

      // Reset form and refresh list
      setFormData(initialFormState);
      setEditingId(null);
      fetchMovies();
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Failed to save movie.");
    }
  };

  const handleEdit = (movie) => {
    setEditingId(movie.id);
    setFormData({
      title: movie.title || "",
      description: movie.description || "",
      language: movie.language || "",
      hr_image: movie.hr_image || "",
      vl_image: movie.vl_image || "",
      price: movie.price || "",
      durationMinutes: movie.durationMinutes || "",
      movieDateTime: movie.movieDateTime
        ? movie.movieDateTime.substring(0, 16)
        : "",
      maxCapacity: movie.maxCapacity || "",
      theaterId: movie.theater ? movie.theater.id : "",
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this movie?")) {
      try {
        await axiosInstance.delete(`api/movies/${id}`);
        alert("Movie deleted successfully!");
        fetchMovies();
      } catch (error) {
        console.error("Error deleting movie:", error);
        alert("Failed to delete movie.");
      }
    }
  };

  const handleCancelEdit = () => {
    setFormData(initialFormState);
    setEditingId(null);
  };

  return (
    <>
      <Navbar />
      <div
        style={{
          padding: "20px",
          maxWidth: "1000px",
          margin: "0 auto",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <h2>{editingId ? "Edit Movie" : "Add New Movie"}</h2>

        {/* Form Section */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: "15px",
            marginBottom: "40px",
            background: "#f9f9f9",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "15px",
            }}
          >
            <div>
              <label>Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Theater *</label>
              <select
                name="theaterId"
                value={formData.theaterId}
                onChange={handleInputChange}
                required
                style={inputStyle}
              >
                <option value="">-- Select a Theater --</option>
                {theaters.map((theater) => (
                  <option key={theater.id} value={theater.id}>
                    {theater.name} ({theater.location})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Language</label>
              <input
                type="text"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Horizontal Image URL</label>
              <input
                type="text"
                name="hr_image"
                value={formData.hr_image}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Vertical Image URL</label>
              <input
                type="text"
                name="vl_image"
                value={formData.vl_image}
                onChange={handleInputChange}
                style={inputStyle}
              />
            </div>

            <div>
              <label>Duration (Minutes) *</label>
              <input
                type="number"
                name="durationMinutes"
                value={formData.durationMinutes}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Price (per ticket) </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Max Capacity *</label>
              <input
                type="number"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label>Showtime *</label>
              <input
                type="datetime-local"
                name="movieDateTime"
                value={formData.movieDateTime}
                onChange={handleInputChange}
                required
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              style={{ ...inputStyle, resize: "vertical" }}
            ></textarea>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button type="submit" style={btnStyle("green")}>
              {editingId ? "Update Movie" : "Save Movie"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={btnStyle("gray")}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* List Section */}
        <h2>Manage Movies</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f1f1f1" }}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Language</th>
              <th style={thStyle}>Theater</th>
              <th style={thStyle}>Showtime</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {movies.length > 0 ? (
              movies.map((movie) => (
                <tr key={movie.id} style={{ borderBottom: "1px solid #ddd" }}>
                  <td style={tdStyle}>{movie.id}</td>
                  <td style={tdStyle}>{movie.title}</td>
                  <td style={tdStyle}>{movie.language}</td>
                  <td style={tdStyle}>
                    {movie.theater ? movie.theater.name : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    {movie.movieDateTime
                      ? new Date(movie.movieDateTime).toLocaleString()
                      : "N/A"}
                  </td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleEdit(movie)}
                      style={btnStyle("blue", true)}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(movie.id)}
                      style={btnStyle("red", true)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No movies found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  marginTop: "5px",
  boxSizing: "border-box",
  border: "1px solid #ccc",
  borderRadius: "4px",
};

const thStyle = {
  padding: "12px",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "12px",
};

const btnStyle = (color, small = false) => ({
  backgroundColor: color,
  color: "white",
  padding: small ? "6px 12px" : "10px 20px",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  marginRight: small ? "5px" : "0",
});

export default AddMovies;
