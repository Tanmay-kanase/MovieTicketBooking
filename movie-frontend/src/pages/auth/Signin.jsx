import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../config/axiosConfig";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./Signin.css";
import { AuthContext } from "../../context/AuthContext";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const clientId =
    "543095501152-ijjcpgtomrp7lsmc7rba2mpujmtirh24.apps.googleusercontent.com";

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      console.log("Login successful:", response.data);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setIsLoading(true);
    try {
      const response = await axiosInstance.post("/api/users/google-login", {
        token: credentialResponse.credential,
      });

      if (response.status === 202) {
        setNewGoogleUser({
          email: response.data.email,
          name: response.data.name,
        });
      } else if (response.status === 200) {
        console.log("Google Login successful:", response.data);
        login(response.data.user);
        navigate("/");
      }
    } catch {
      setError("Google authentication failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Google Login failed to initialize.");
  };

  const handleCompleteGoogleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/users/signup", {
        email: newGoogleUser.email,
        name: newGoogleUser.name,
        password: newPassword,
        role: "USER",
      });

      console.log("Google Signup Complete:", response.data);
      window.location.href = "/dashboard";
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("User already exists.");
      } else {
        setError("Failed to complete signup.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  if (newGoogleUser) {
    return (
      <div className="signin-container">
        <div className="signin-card">
          <h2 className="signin-title">Almost there!</h2>
          <p className="signin-subtitle">
            Create a password for your account, {newGoogleUser.name}.
          </p>

          {error && (
            <div
              className="error-message"
              style={{
                color: "#d32f2f",
                marginBottom: "15px",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleCompleteGoogleSignup} className="signin-form">
            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Saving..." : "Complete Sign Up"}
            </button>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">Log in to book your tickets</p>

        {error && (
          <div
            className="error-message"
            style={{
              color: "#d32f2f",
              marginBottom: "15px",
              fontSize: "14px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="signin-form">
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="form-actions">
            <a href="/forgot-password" className="text-link">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              width="100%"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="signup-prompt">
          New here?{" "}
          <a href="/signup" className="text-link red-bold">
            Sign up now
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
