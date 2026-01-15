import { useEffect, useMemo, useState } from "react";
import { cancelBooking, getMyBookings } from "../../api/bookingApi";
import BookingStatusBadge from "../../components/booking/BookingStatusBadge";
import "../../styles/utilities.css";
import "./MyBookingsPage.css";
import Modal from "../../components/ui/Modal";
import BookingDetails from "../../components/booking/BookingDetails";


const TABS = ["ALL", "PENDING", "APPROVED", "REJECTED", "CANCELLED"];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [tab, setTab] = useState("ALL");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("NEWEST"); // NEWEST | OLDEST | AMOUNT_HIGH

  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  const openDetails = (booking) => {
    setSelected(booking);
    setOpen(true);
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data || []);
    } catch (err) {
      setMsg("❌ Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    try {
      await cancelBooking(bookingId);
      setMsg("✅ Booking cancelled");
      loadBookings();
    } catch (err) {
      setMsg(err?.response?.data || "❌ Cancel failed");
    }
  };

  const filteredBookings = useMemo(() => {
    let list = [...bookings];

    // tab filter
    if (tab !== "ALL") {
      list = list.filter((b) => b.status === tab);
    }

    // search
    const key = search.trim().toLowerCase();
    if (key) {
      list = list.filter((b) => {
        const brandModel = `${b.carBrand} ${b.carModel}`.toLowerCase();
        const idText = String(b.bookingId);
        return brandModel.includes(key) || idText.includes(key);
      });
    }

    // sort
    if (sort === "NEWEST") {
      list.sort((a, b) => b.bookingId - a.bookingId);
    } else if (sort === "OLDEST") {
      list.sort((a, b) => a.bookingId - b.bookingId);
    } else if (sort === "AMOUNT_HIGH") {
      list.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0));
    }

    return list;
  }, [bookings, tab, search, sort]);

  return (
    <main className="container section">
      <div className="b-top">
        <div>
          <h2 className="page-title">My Bookings</h2>
          <p className="page-sub">Track, filter and manage your reservations.</p>
        </div>

        <div className="b-tools">
          <input
            className="b-search"
            placeholder="Search (Toyota, Aqua, #1)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="b-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="NEWEST">Newest</option>
            <option value="OLDEST">Oldest</option>
            <option value="AMOUNT_HIGH">Highest Amount</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="b-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            className={`b-tab ${tab === t ? "active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && <p className="b-note">{msg}</p>}

      {loading ? (
        <p className="muted2">Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="muted2">No bookings found.</p>
      ) : (
        <section className="b-grid">
          {filteredBookings.map((b) => (
            <article
              className="b-item card b-click"
              key={b.bookingId}
              onClick={() => openDetails(b)}
            >
              <div className="b-head">
                <h3 className="b-car">
                  {b.carBrand} {b.carModel}
                </h3>
                <BookingStatusBadge status={b.status} />
              </div>

              <div className="b-info">
                <p>
                  <span>Booking</span> #{b.bookingId}
                </p>
                <p>
                  <span>Date</span> {b.startDate} → {b.endDate}
                </p>
                <p>
                  <span>Days</span> {b.totalDays}
                </p>
              </div>

              <div className="b-bottom">
                <p className="b-price">
                  Rs. <b>{b.totalAmount}</b>
                </p>

                <button
                  className="b-cancel"
                  disabled={b.status !== "PENDING"}
                  onClick={(e) => {
                    e.stopPropagation();        // ✅ modal open නොවෙන්න stop
                    handleCancel(b.bookingId);  // ✅ cancel function call
                  }}
                  title={
                    b.status !== "PENDING"
                      ? "Only pending bookings can be cancelled"
                      : "Cancel booking"
                  }
                >
                Cancel
              </button>
            </div>
            </article>
      ))}
    </section>
  )
}
<Modal
  open={open}
  title="Booking Details"
  onClose={() => setOpen(false)}
>
  <BookingDetails booking={selected} />
</Modal>

    </main >
  );
}
