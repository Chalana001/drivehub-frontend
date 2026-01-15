import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getBookingsAdmin, getCarsCount } from "../../../api/adminDashboardApi";
import useCountUp from "../../../hooks/useCountUp";
import BookingStatusBadge from "../../../components/booking/BookingStatusBadge";
import Modal from "../../../components/ui/Modal";
import BookingDetails from "../../../components/booking/BookingDetails";

import "../../../styles/utilities.css";
import "./AdminDashboardPage.css";
import RevenueChart from "../../../components/admin/RevenueChart";

export default function AdminDashboardPage() {
  const [carsCount, setCarsCount] = useState(0);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // modal
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDetails = (b) => {
    setSelected(b);
    setOpen(true);
  };

  const loadStats = async () => {
    try {
      setLoading(true);
      const [cars, allBookings] = await Promise.all([
        getCarsCount(),
        getBookingsAdmin(),
      ]);

      setCarsCount(cars);
      setBookings(allBookings);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // stats
  const totalBookings = bookings.length;

  const pendingCount = useMemo(
    () => bookings.filter((b) => b.status === "PENDING").length,
    [bookings]
  );

  const approvedCount = useMemo(
    () => bookings.filter((b) => b.status === "APPROVED").length,
    [bookings]
  );

  // profit-like total revenue
  const totalRevenue = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "APPROVED")
        .reduce((sum, b) => sum + (Number(b.totalAmount) || 0), 0),
    [bookings]
  );

  // count-up animations
  const carsCountAnim = useCountUp(loading ? 0 : carsCount);
  const totalBookingsAnim = useCountUp(loading ? 0 : totalBookings);
  const pendingAnim = useCountUp(loading ? 0 : pendingCount);
  const approvedAnim = useCountUp(loading ? 0 : approvedCount);
  const revenueAnim = useCountUp(loading ? 0 : totalRevenue, 900);

  // latest 5 bookings
  const latestBookings = useMemo(() => {
    return [...bookings].sort((a, b) => b.bookingId - a.bookingId).slice(0, 5);
  }, [bookings]);

  const monthlyRevenue = useMemo(() => {
  // last 6 months buckets
  const now = new Date();
  const months = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("en-US", { month: "short" });
    months.push({ key, label, value: 0 });
  }

  // since booking response has only dates, use startDate month as booking month
  bookings
    .filter((b) => b.status === "APPROVED")
    .forEach((b) => {
      const dt = new Date(b.startDate);
      if (isNaN(dt)) return;

      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      const found = months.find((m) => m.key === key);
      if (found) found.value += Number(b.totalAmount) || 0;
    });

  // return only label + value
  return months.map((m) => ({
    label: m.label,
    value: Math.round(m.value),
  }));
}, [bookings]);


  return (
    <main className="container section admin">
      <div className="admin-head">
        <div>
          <h2 className="page-title">Admin Dashboard</h2>
          <p className="page-sub">
            Quick overview with bookings + revenue performance.
          </p>
        </div>

        <button className="admin-refresh" onClick={loadStats}>
          Refresh
        </button>
      </div>

      {/* Actions */}
      <section className="admin-actions">
        <Link className="admin-btn" to="/admin/bookings">
          Manage Bookings
        </Link>

        <Link className="admin-btn" to="/admin/cars">
          Manage Cars
        </Link>
      </section>

      {/* Stats */}
      <section className="admin-stats">
        <div className="card stat glow">
          <h4>Total Cars</h4>
          <p>{loading ? "..." : carsCountAnim}</p>
        </div>

        <div className="card stat glow">
          <h4>Total Bookings</h4>
          <p>{loading ? "..." : totalBookingsAnim}</p>
        </div>

        <div className="card stat glow">
          <h4>Pending</h4>
          <p>{loading ? "..." : pendingAnim}</p>
        </div>

        <div className="card stat glow">
          <h4>Approved</h4>
          <p>{loading ? "..." : approvedAnim}</p>
        </div>

        <div className="card stat revenue">
          <h4>Total Revenue</h4>
          <p className="gold">
            {loading ? "..." : `Rs. ${revenueAnim.toLocaleString()}`}
          </p>
        </div>
      </section>

      {/* Latest bookings */}
      <section className="card latest">
        <div className="latest-head">
          <div>
            <h3>Latest Bookings</h3>
            <p className="muted2">Click a row to view details</p>
          </div>

          <Link className="latest-link" to="/admin/bookings">
            View All →
          </Link>
        </div>

        {loading ? (
          <p className="muted2">Loading...</p>
        ) : latestBookings.length === 0 ? (
          <p className="muted2">No bookings yet.</p>
        ) : (
          <div className="latest-table">
            {latestBookings.map((b) => (
              <div
                key={b.bookingId}
                className="latest-row"
                onClick={() => openDetails(b)}
              >
                <div className="l-id">#{b.bookingId}</div>
                <div className="l-car">
                  {b.carBrand} {b.carModel}
                </div>
                <div className="l-amt">Rs. {b.totalAmount}</div>
                <div className="l-status">
                  <BookingStatusBadge status={b.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="card latest">
  <div className="latest-head">
    <div>
      <h3>Monthly Revenue (Last 6 Months)</h3>
      <p className="muted2">Based on APPROVED bookings only</p>
    </div>
  </div>

  <RevenueChart data={monthlyRevenue} />
</section>


      {/* modal */}
      <Modal
        open={open}
        title="Booking Details"
        onClose={() => setOpen(false)}
      >
        <BookingDetails booking={selected} />
      </Modal>
      
    </main>
  );
}
