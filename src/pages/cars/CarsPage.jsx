import { useEffect, useMemo, useState } from "react";
import { getAllCars } from "../../api/carApi";
import CarGrid from "../../components/car/CarGrid";
import "../../styles/utilities.css";
import "./CarsPage.css";

export default function CarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadCars = async () => {
      try {
        setLoading(true);
        const res = await getAllCars();
        setCars(res.data);
      } catch (err) {
        setError("Failed to load cars. Please login again.");
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    const key = search.toLowerCase().trim();
    if (!key) return cars;

    return cars.filter((c) =>
      `${c.brand} ${c.model}`.toLowerCase().includes(key)
    );
  }, [cars, search]);

  return (
    <main className="container section">
      <div className="cars-top">
        <div>
          <h2 className="page-title">Browse Cars</h2>
          <p className="page-sub">Choose luxury. Drive smooth.</p>
        </div>

        <input
          className="cars-search"
          placeholder="Search by brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p className="muted2">Loading cars...</p>}
      {error && <p className="err">{error}</p>}

      {!loading && !error && <CarGrid cars={filteredCars} />}
    </main>
  );
}
