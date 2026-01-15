import "./BookingStatusBadge.css";

export default function BookingStatusBadge({ status }) {
  const s = (status || "").toLowerCase();

  return <span className={`b-status ${s}`}>{status}</span>;
}
