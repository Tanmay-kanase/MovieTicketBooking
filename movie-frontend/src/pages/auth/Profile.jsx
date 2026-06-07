import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import "./Profile.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosConfig";

const Profile = () => {
  const { user, login, logout, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState({ type: "", text: "" });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/signin");
    } else if (user) {
      setId(user.id);
      setName(user.name);
    }
  }, [user, isLoading, navigate]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setIsSaving(true);

    try {
      const response = await axiosInstance.put(`/api/users/${id}`, {
        name: name,
      });

      login(response.data.user);

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setIsEditing(false);

      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    } catch {
      setMessage({
        type: "error",
        text: "Failed to update profile. Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading || !user) {
    return <div className="profile-loading">Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Profile Header & Avatar */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="profile-title-block">
            <h2>{user.name}</h2>
            <span className="profile-role">
              {user.role === "USER" ? "Movie Enthusiast" : "Administrator"}
            </span>
          </div>
        </div>

        {/* Success/Error Message Banner */}
        {message.text && (
          <div className={`message-banner ${message.type}`}>{message.text}</div>
        )}

        {/* Profile Details & Edit Form */}
        <div className="profile-content">
          <div className="section-header">
            <h3>Personal Information</h3>
            {!isEditing && (
              <button className="btn-text" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="input-group">
                <label htmlFor="name">Display Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={user.email}
                  disabled
                  className="disabled-input"
                  title="Email cannot be changed"
                />
                <span className="input-help">
                  Email is tied to your account and cannot be changed here.
                </span>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name); // Reset to original
                    setMessage({ type: "", text: "" });
                  }}
                  disabled={isSaving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-label">Full Name</span>
                <span className="detail-value">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email Address</span>
                <span className="detail-value">{user.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Account Status</span>
                <span className="detail-value text-green">Active</span>
              </div>
            </div>
          )}
        </div>

        {/* Danger Zone */}
        <div className="danger-zone">
          <button onClick={logout} className="btn-logout">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
