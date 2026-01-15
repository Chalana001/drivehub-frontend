import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCarById } from "../../api/carApi";
import { createBooking } from "../../api/bookingApi";
import "../../styles/utilities.css";
import "./CarDetailsPage.css";

export default function CarDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [msg, setMsg] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const loadCar = async () => {
      try {
        setLoading(true);
        const res = await getCarById(id);
        setCar(res.data);
      } catch (err) {
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    loadCar();
  }, [id]);

  const handleBooking = async () => {
    setMsg("");

    if (!car?.carId) {
      setMsg("❌ Car info missing. Please refresh.");
      return;
    }

    if (!startDate || !endDate) {
      setMsg("❌ Please select start & end dates.");
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setMsg("❌ End date cannot be before start date.");
      return;
    }

    try {
      setBookingLoading(true);

      await createBooking({
        carId: car.carId, // ✅ correct
        startDate,
        endDate,
      });

      setMsg("✅ Booking created! Redirecting...");
      setTimeout(() => navigate("/bookings"), 700);
    } catch (err) {
      setMsg(err?.response?.data || "❌ Booking failed. Try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="container section">
        <p className="muted2">Loading car details...</p>
      </main>
    );
  }

  if (!car) {
    return (
      <main className="container section">
        <p className="err">Car not found.</p>
      </main>
    );
  }

  const totalDays =
    startDate && endDate
      ? Math.max(
          1,
          Math.ceil(
            (new Date(endDate).getTime() - new Date(startDate).getTime()) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const totalPrice = totalDays ? totalDays * car.pricePerDay : 0;

  return (
    <main className="container section details">
      <div className="details-left">
        <div className="details-img card">
          <img
            src={
              car.imageUrl && car.imageUrl.trim()
                ? car.imageUrl
                : "/assets/car-default.jpg"
            }
            onError={(e) => (e.currentTarget.src = "/assets/car-default.jpg")}
            alt={`${car.brand} ${car.model}`}
          />
        </div>

        <div className="details-info card">
          <h2>
            {car.brand} {car.model}
          </h2>
          <p className="muted2">
            {car.carType} • {car.fuelType} • {car.transmission} • {car.seats}{" "}
            Seats
          </p>
        </div>
      </div>

      <aside className="details-right card">
        <h3 className="b-title">Book this car</h3>

        <div className="b-row">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="b-row">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            min={startDate || new Date().toISOString().split("T")[0]}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="b-total">
          <p>
            Price/day: <b>Rs. {car.pricePerDay}</b>
          </p>
          <p>
            Days: <b>{totalDays || "-"}</b>
          </p>
          <p className="grand">
            Total: <b>Rs. {totalPrice || "-"}</b>
          </p>
        </div>

        <button
          className="book-btn"
          onClick={handleBooking}
          disabled={car.status !== "AVAILABLE" || bookingLoading}
        >
          {bookingLoading
            ? "Booking..."
            : car.status === "AVAILABLE"
            ? "Confirm Booking"
            : "Not Available"}
        </button>

        {msg && <p className="b-msg">{msg}</p>}
      </aside>
    </main>
  );
}
