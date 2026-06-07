import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function HomeNav() {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  return (
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
        {user ? (
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
                <div className="avatar-circle">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span>{user.name}</span>
              </button>

              <div className="dropdown-content">
                <button onClick={() => navigate("/profile")}>My Profile</button>
                <button onClick={logout} className="text-red">
                  Logout
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button className="btn-outline" onClick={() => navigate("/signin")}>
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}

export default HomeNav;
