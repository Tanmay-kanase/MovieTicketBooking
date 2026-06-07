import React, { useState, useEffect } from "react";
import axiosInstance from "../../../config/axiosConfig"; // Adjust path if needed
import "./Theaters.css";
import Navbar from "../home/Navbar";

const Theaters = () => {
  const [theaters, setTheaters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    totalCapacity: "",
  });
  const [editingId, setEditingId] = useState(null);

  // Fetch all theaters on mount
  useEffect(() => {
    fetchTheaters();
  }, []);

  const fetchTheaters = async () => {
    try {
      const response = await axiosInstance.get("/api/theaters");
      setTheaters(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Failed to fetch theaters");
      setLoading(false);
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update existing theater
        const response = await axiosInstance.put(
          `/api/theaters/${editingId}`,
          formData,
        );
        setTheaters(
          theaters.map((t) => (t.id === editingId ? response.data : t)),
        );
        setEditingId(null);
      } else {
        // Create new theater
        const response = await axiosInstance.post("/api/theaters", formData);
        setTheaters([...theaters, response.data]);
      }
      // Reset form
      setFormData({ name: "", location: "", totalCapacity: "" });
    } catch (err) {
      alert("Error saving theater: " + (err.message || "Unknown error"));
    }
  };

  // Populate form for editing
  const handleEdit = (theater) => {
    setEditingId(theater.id);
    setFormData({
      name: theater.name,
      location: theater.location,
      totalCapacity: theater.totalCapacity,
    });
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: "", location: "", totalCapacity: "" });
  };

  // Delete a theater
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this theater?"))
      return;

    try {
      await axiosInstance.delete(`/api/theaters/${id}`);
      setTheaters(theaters.filter((t) => t.id !== id));
    } catch (err) {
      alert("Error deleting theater: " + (err.message || "Unknown error"));
    }
  };

  return (
    <>
      <Navbar />
      <div className="theaters-container">
        <div className="theaters-header">
          <h2>Theater </h2>
        </div>

        <div className="theaters-content">
          {/* Form Section */}
          <div className="theater-form-card">
            <h3>{editingId ? "Edit Theater" : "Add New Theater"}</h3>
            <form onSubmit={handleSubmit} className="theater-form">
              <div className="form-group">
                <label>Theater Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. PVR Cinemas"
                  required
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. City Mall"
                  required
                />
              </div>
              <div className="form-group">
                <label>Total Capacity</label>
                <input
                  type="number"
                  name="totalCapacity"
                  value={formData.totalCapacity}
                  onChange={handleChange}
                  placeholder="e.g. 200"
                  required
                  min="1"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingId ? "Update Theater" : "Add Theater"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* List Section */}
          <div className="theater-list-card">
            <h3>Current Theaters</h3>
            {loading && <p className="loading">Loading theaters...</p>}
            {error && <p className="error">{error}</p>}

            {!loading && !error && (
              <table className="theaters-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Location</th>
                    <th>Capacity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {theaters.map((theater) => (
                    <tr key={theater.id}>
                      <td>#{theater.id}</td>
                      <td>
                        <strong>{theater.name}</strong>
                      </td>
                      <td>{theater.location}</td>
                      <td>{theater.totalCapacity} seats</td>
                      <td>
                        <div className="table-actions">
                          <button
                            className="btn-edit"
                            onClick={() => handleEdit(theater)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-delete"
                            onClick={() => handleDelete(theater.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {theaters.length === 0 && (
                    <tr>
                      <td colSpan="5" className="empty-state">
                        No theaters available. Add one above!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Theaters;
