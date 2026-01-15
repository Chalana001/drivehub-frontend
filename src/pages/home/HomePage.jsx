import "../../styles/utilities.css";
import "./HomePage.css";

export default function HomePage() {
  return (
    <main className="container section home">
      <div className="hero">
        <img
          className="hero-logo"
          src="/assets/drivehub-logo.png"
          alt="DriveHub Logo"
        />

        <h1 className="title">DriveHub</h1>

        <p className="subtitle">
          Premium car rentals with a luxury experience.
        </p>

        <div className="hero-actions">
          <a className="btn primary" href="/cars">
            Browse Cars
          </a>
          <a className="btn ghost" href="/bookings">
            My Bookings
          </a>
        </div>

        {/* ✅ Feature Cards */}
        <section className="features">
          <article className="feature card">
            <div className="f-icon">🔒</div>
            <h3>Secure Booking</h3>
            <p>
              Book confidently with JWT secured access and protected booking flow.
            </p>
          </article>

          <article className="feature card">
            <div className="f-icon">🚘</div>
            <h3>Luxury Fleet</h3>
            <p>
              Choose from premium vehicles maintained for comfort, style and safety.
            </p>
          </article>

          <article className="feature card">
            <div className="f-icon">📞</div>
            <h3>24/7 Support</h3>
            <p>
              We’re always ready to help for reservations, cancellations and issues.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
