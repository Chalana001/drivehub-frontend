import { Link } from "react-router-dom";
import "../../../styles/utilities.css";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  return (
    <main className="container section admin">
      <div className="admin-head">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-sub">Manage cars and bookings.</p>
        </div>
      </div>

      <section className="admin-actions">
        <Link className="admin-btn" to="/admin/bookings">
          Manage Bookings
        </Link>

        <Link className="admin-btn" to="/admin/cars">
          Manage Cars
        </Link>
      </section>

      <section className="admin-stats">
        <div className="card stat">
          <h4>Total Cars</h4>
          <p>--</p>
        </div>

        <div className="card stat">
          <h4>Total Bookings</h4>
          <p>--</p>
        </div>

        <div className="card stat">
          <h4>Pending</h4>
          <p>--</p>
        </div>
      </section>
    </main>
  );
}
