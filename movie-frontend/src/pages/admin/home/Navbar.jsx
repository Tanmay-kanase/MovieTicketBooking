import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { useContext } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    navigate("/admin-signin");
  };
  return (
    <nav className="admin-navbar">
      <div
        className="navbar-brand"
        onClick={() => {
          navigate("/admin-dashboard");
        }}
      >
        <h2>Admin Portal</h2>
      </div>
      <ul className="navbar-links">
        <li>
          <Link to="/admin-dashboard" className="active">
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/add-movie">Movies</Link>
        </li>
        <li>
          <Link to="/theater">Theaters</Link>
        </li>
      </ul>
      <div
        className="navbar-user"
        style={{ display: "flex", alignItems: "center", gap: "15px" }}
      >
        <span>Admin User</span>
        <button onClick={handleLogout} className="admin-logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
