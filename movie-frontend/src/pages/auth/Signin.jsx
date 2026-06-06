import { useState } from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import "./SignIn.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Replace with your actual Google Client ID
  const clientId = "YOUR_GOOGLE_CLIENT_ID";

  const handleEmailLogin = (e) => {
    e.preventDefault();
    // TODO: Send credentials to your Spring Boot backend authentication endpoint
    console.log("Authenticating:", { email, password });
  };

  const handleGoogleSuccess = (credentialResponse) => {
    // TODO: Send the received Google token to your backend to validate and establish a session
    console.log("Google Auth Success:", credentialResponse);
  };

  const handleGoogleError = () => {
    console.error("Google Login Failed");
  };

  return (
    <div className="signin-container">
      <div className="signin-card">
        <h2 className="signin-title">Welcome Back</h2>
        <p className="signin-subtitle">Log in to book your tickets</p>

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

          <button type="submit" className="btn-primary">
            Sign In
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
