import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./Signup.css";
import { AuthContext } from "../../context/AuthContext";
import axiosInstance from "../../config/axiosConfig";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newGoogleUser, setNewGoogleUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const clientId = "YOUR_GOOGLE_CLIENT_ID";

  const handleStandardSignUp = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axiosInstance.post("/api/users/signup", {
        name,
        email,
        password,
        role: "USER",
      });

      console.log("Signup successful:", response.data);
      login(response.data.user);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError("An account with this email already exists.");
      } else {
        setError("Failed to create account. Please try again.");
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
        login(response.data.user);
        navigate("/");
      }
    } catch {
      setError("Google signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

      login(response.data.user);
      navigate("/");
    } catch {
      setError("Failed to complete signup.");
    } finally {
      setIsLoading(false);
    }
  };
  if (newGoogleUser) {
    return (
      <div className="signup-container">
        <div className="signup-card">
          <h2 className="signup-title">Almost Done!</h2>
          <p className="signup-subtitle">
            Secure your TicketHub account, {newGoogleUser.name}.
          </p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleCompleteGoogleSignup} className="signup-form">
            <div className="input-group">
              <label htmlFor="newPassword">Create Password</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Must be at least 6 characters"
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Complete Sign Up"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2 className="signup-title">Create an Account</h2>
        <p className="signup-subtitle">Join TicketHub to book your movies</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleStandardSignUp} className="signup-form">
          <div className="input-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

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

          <div className="">
            <div className="input-group half-width">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6+ characters"
                required
              />
            </div>

            <div className="input-group half-width">
              <label htmlFor="confirmPassword">Confirm</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat password"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="divider">
          <span>OR</span>
        </div>

        <div className="google-login-wrapper">
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google integration failed.")}
              theme="outline"
              size="large"
              width="100%"
              text="signup_with"
            />
          </GoogleOAuthProvider>
        </div>

        <div className="login-prompt">
          Already have an account?{" "}
          <span
            className="text-link red-bold"
            onClick={() => navigate("/signin")}
            style={{ cursor: "pointer" }}
          >
            Log in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
