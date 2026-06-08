import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import { AuthContext } from "../../context/AuthContext";
import "./AdminSignin.css";

const AdminSignin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      if (response.data.user.role !== "ADMIN") {
        setError("Access denied. Admin privileges required.");
        setIsLoading(false);
        return;
      }

      console.log("Admin Login successful:", response.data);
      login(response.data.user);
      navigate("/admin-dashboard");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid admin credentials.");
      } else if (err.response && err.response.status === 403) {
        setError("Access forbidden.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-signin-container">
      <div className="admin-signin-card">
        <div className="admin-badge">Admin Portal</div>
        <h2 className="admin-signin-title">System Administrator</h2>
        <p className="admin-signin-subtitle">Please enter your credentials</p>

        {error && <div className="admin-error-message">{error}</div>}

        <form onSubmit={handleAdminLogin} className="admin-signin-form">
          <div className="admin-input-group">
            <label htmlFor="admin-email">Admin Email</label>
            <input
              type="email"
              id="admin-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@system.com"
              required
            />
          </div>

          <div className="admin-input-group">
            <label htmlFor="admin-password">Password</label>
            <input
              type="password"
              id="admin-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="admin-btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Authenticating..." : "Login to Dashboard"}
          </button>
        </form>

        <div className="admin-footer">
          <button
            onClick={() => navigate("/signin")}
            className="back-to-user-btn"
          >
            &larr; Back to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSignin;
