import { Link } from "react-router-dom";
import "./CarItem.css";

export default function CarItem({ car }) {
  const {
    carId,
    brand,
    model,
    carType,
    fuelType,
    seatingCapacity,
    transmission,
    pricePerDay,
    status,
    imageUrl,
  } = car;
  return (
    <article className="car-item">
      <div className="car-img">
        <img
          src={imageUrl && imageUrl.trim() ? imageUrl : "/assets/car-default.jpg"}
          alt={`${brand} ${model}`}
          loading="lazy"
        />
        <span className={`car-badge ${status?.toLowerCase()}`}>{status}</span>
      </div>

      <div className="car-body">
        <h3 className="car-title">
          {brand} {model}
        </h3>

        <p className="car-sub">
          {carType} • {fuelType} • {transmission} • {seatingCapacity} Seats
        </p>

        <div className="car-bottom">
          <div className="car-price">
            <span>Rs.</span> {pricePerDay} <small>/ day</small>
          </div>

          <Link className="car-btn" to={`/cars/${carId}`}>
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
