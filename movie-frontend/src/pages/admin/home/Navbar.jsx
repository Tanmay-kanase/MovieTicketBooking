import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="admin-navbar">
      <div className="navbar-brand">
        <h2>🎬 Admin Portal</h2>
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
        <li>
          <Link to="/admin/bookings">Bookings</Link>
        </li>
      </ul>
      <div className="navbar-user">
        <span>Admin User</span>
      </div>
    </nav>
  );
}

export default Navbar;
