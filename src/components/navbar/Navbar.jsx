import { Link } from "react-router-dom";
import ThemeToggle from "../ui/ThemeToggle";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="nav-logo" to="/">
          Drive<span>Hub</span>
        </Link>

        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/cars">Cars</Link>

          {isLoggedIn && role === "ADMIN" && (
            <>
              <Link to="/admin/dashboard">Admin</Link>
              <Link to="/admin/bookings">Bookings</Link>
              <Link to="/admin/cars">Cars</Link>
            </>
          )}

          {isLoggedIn && role === "CUSTOMER" && (
            <Link to="/bookings">My Bookings</Link>
          )}
        </nav>

        <div className="nav-right">
          <ThemeToggle />

          {!isLoggedIn ? (
            <Link className="nav-login" to="/login">Login</Link>
          ) : (
            <button className="nav-logout" onClick={logout}>Logout</button>
          )}
        </div>
      </div>
    </header>
  );
}
