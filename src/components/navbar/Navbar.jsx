import { Link } from "react-router-dom";
import { useState } from "react";
import ThemeToggle from "../ui/ThemeToggle";
import useAuth from "../../hooks/useAuth";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn, role, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  return (
    <header className="nav">
      <div className="container nav-inner">
        <Link className="nav-logo" to="/" onClick={closeMenu}>
          Drive<span>Hub</span>
        </Link>

        {/* ✅ Hamburger (mobile only) */}
        <button
  className="nav-hamburger"
  onClick={() => setOpen((p) => !p)}
  aria-label="Toggle Menu"
>
  {open ? "✕" : "☰"}
</button>


        {/* ✅ Desktop Links */}
        <nav className="nav-links">
          <Link to="/">Home</Link>

          {isLoggedIn && role === "ADMIN" && (
            <>
              <Link to="/admin/dashboard">Dashboard</Link>
              <Link to="/admin/bookings">Bookings</Link>
              <Link to="/admin/cars">Cars</Link>
            </>
          )}

          {isLoggedIn && role === "CUSTOMER" && (
            <>
              <Link to="/cars">Cars</Link>
              <Link to="/bookings">My Bookings</Link>
            </>
          )}
        </nav>

        {/* ✅ Desktop Right */}
        <div className="nav-right">
          <ThemeToggle />

          {!isLoggedIn ? (
            <Link className="nav-login" to="/login">
              Login
            </Link>
          ) : (
            <button className="nav-logout" onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* ✅ Mobile dropdown menu */}
      {open && (
        <div className="nav-mobile">
          <div className="nav-mobile-links">
            <Link to="/" onClick={closeMenu}>
              Home
            </Link>

            {isLoggedIn && role === "ADMIN" && (
              <>
                <Link to="/admin/dashboard" onClick={closeMenu}>
                  Dashboard
                </Link>
                <Link to="/admin/bookings" onClick={closeMenu}>
                  Bookings
                </Link>
                <Link to="/admin/cars" onClick={closeMenu}>
                  Cars
                </Link>
              </>
            )}

            {isLoggedIn && role === "CUSTOMER" && (
              <>
                <Link to="/cars" onClick={closeMenu}>
                  Cars
                </Link>
                <Link to="/bookings" onClick={closeMenu}>
                  My Bookings
                </Link>
              </>
            )}
          </div>

          {/* ✅ Mobile actions INSIDE menu */}
          <div className="nav-mobile-actions">
            <ThemeToggle />

            {!isLoggedIn ? (
              <Link className="nav-login" to="/login" onClick={closeMenu}>
                Login
              </Link>
            ) : (
              <button
                className="nav-logout"
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
