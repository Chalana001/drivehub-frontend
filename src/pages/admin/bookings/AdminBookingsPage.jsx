import { useEffect, useMemo, useState } from "react";
import {
  approveBookingAdmin,
  getAllBookingsAdmin,
  rejectBookingAdmin,
} from "../../../api/adminBookingApi";

import BookingStatusBadge from "../../../components/booking/BookingStatusBadge";
import Modal from "../../../components/ui/Modal";
import BookingDetails from "../../../components/booking/BookingDetails";

import "../../../styles/utilities.css";
import "./AdminBookingsPage.css";

const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getAllBookingsAdmin();
      setBookings(res.data || []);
    } catch (e) {
      setMsg("❌ Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const openDetails = (booking) => {
    setSelected(booking);
    setOpen(true);
  };

  const handleApprove = async (bookingId) => {
    try {
      await approveBookingAdmin(bookingId);
      setMsg("✅ Booking Approved");
      loadBookings();
    } catch (e) {
      setMsg(e?.response?.data || "❌ Approve failed");
    }
  };

  const handleReject = async (bookingId) => {
    try {
      await rejectBookingAdmin(bookingId);
      setMsg("✅ Booking Rejected");
      loadBookings();
    } catch (e) {
      setMsg(e?.response?.data || "❌ Reject failed");
    }
  };

  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    if (tab !== "ALL") list = list.filter((b) => b.status === tab);

    const key = search.trim().toLowerCase();
    if (key) {
      list = list.filter((b) => {
        const brandModel = `${b.carBrand} ${b.carModel}`.toLowerCase();
        const idText = String(b.bookingId);
        const customerText = (b.customerEmail || "").toLowerCase();
        return (
          brandModel.includes(key) ||
          idText.includes(key) ||
          customerText.includes(key)
        );
      });
    }

    // newest first
    list.sort((a, b) => b.bookingId - a.bookingId);

    return list;
  }, [bookings, tab, search]);

  return (
    <main className="container section">
      <div className="ab-top">
        <div>
          <h2 className="page-title">Admin Bookings</h2>
          <p className="page-sub">Approve or reject customer bookings.</p>
        </div>

        <input
          className="ab-search"
          placeholder="Search (Toyota, #12, email...)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="ab-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`ab-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && <p className="ab-note">{msg}</p>}

      {loading ? (
        <p className="muted2">Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="muted2">No bookings found.</p>
      ) : (
        <section className="ab-grid">
          {filteredBookings.map((b) => (
            <article
              className="ab-item card"
              key={b.bookingId}
              onClick={() => openDetails(b)}
            >
              <div className="ab-head">
                <h3 className="ab-car">
                  {b.carBrand} {b.carModel}
                </h3>
                <BookingStatusBadge status={b.status} />
              </div>

              <div className="ab-info">
                <p>
                  <span>ID</span> #{b.bookingId}
                </p>
                <p>
                  <span>Date</span> {b.startDate} → {b.endDate}
                </p>
                <p>
                  <span>Total</span> Rs. {b.totalAmount}
                </p>
              </div>

              <div className="ab-actions">
                <button
                  className="ab-btn approve"
                  disabled={b.status !== "PENDING"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApprove(b.bookingId);
                  }}
                >
                  Approve
                </button>

                <button
                  className="ab-btn reject"
                  disabled={b.status !== "PENDING"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReject(b.bookingId);
                  }}
                >
                  Reject
                </button>
              </div>
            </article>
          ))}
        </section>
      )}

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
