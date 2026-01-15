import BookingStatusBadge from "./BookingStatusBadge";
import "./BookingDetails.css";

export default function BookingDetails({ booking }) {
  if (!booking) return null;

  return (
    <div className="bd">
      <div className="bd-top">
        <div>
          <h4>
            {booking.carBrand} {booking.carModel}
          </h4>
          <p className="bd-sub">Booking ID: #{booking.bookingId}</p>
        </div>
        <BookingStatusBadge status={booking.status} />
      </div>

      <div className="bd-grid">
        <div className="bd-row">
          <span>Car ID</span>
          <b>{booking.carId}</b>
        </div>

        <div className="bd-row">
          <span>Start Date</span>
          <b>{booking.startDate}</b>
        </div>

        <div className="bd-row">
          <span>End Date</span>
          <b>{booking.endDate}</b>
        </div>

        <div className="bd-row">
          <span>Total Days</span>
          <b>{booking.totalDays}</b>
        </div>

        <div className="bd-row bd-amount">
          <span>Total Amount</span>
          <b>Rs. {booking.totalAmount}</b>
        </div>
      </div>

      <p className="bd-note">
        Luxury guarantee: Your booking will be confirmed by admin approval.
      </p>
    </div>
  );
}
