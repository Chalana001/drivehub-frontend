import CarItem from "./CarItem";
import "./CarGrid.css";

export default function CarGrid({ cars }) {
  return (
    <section className="car-grid">
      {cars.map((car) => (
        <CarItem key={car.carId} car={car} />
      ))}
    </section>
  );
}
