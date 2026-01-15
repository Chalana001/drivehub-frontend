import { useEffect, useMemo, useState } from "react";
import {
  addCarAdmin,
  deleteCarAdmin,
  getAllCarsAdmin,
  updateCarAdmin,
  updateCarStatusAdmin,
} from "../../../api/adminCarApi";

import Modal from "../../../components/ui/Modal";
import "../../../styles/utilities.css";
import "./AdminCarsPage.css";

const STATUS = ["AVAILABLE", "RENTED", "MAINTENANCE"];

const emptyForm = {
  brand: "",
  model: "",
  carType: "",
  fuelType: "",
  seats: 4,
  transmission: "Auto",
  pricePerDay: 0,
  imageUrl: "",
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("ADD"); // ADD | EDIT
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const loadCars = async () => {
    try {
      setLoading(true);
      const res = await getAllCarsAdmin();
      setCars(res.data || []);
    } catch (e) {
      setMsg("❌ Failed to load cars");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    const key = search.trim().toLowerCase();
    if (!key) return cars;

    return cars.filter((c) => {
      const text = `${c.brand} ${c.model} ${c.carType}`.toLowerCase();
      return text.includes(key);
    });
  }, [cars, search]);

  const openAdd = () => {
    setMode("ADD");
    setSelected(null);
    setForm(emptyForm);
    setOpen(true);
    setMsg("");
  };

  const openEdit = (car) => {
    setMode("EDIT");
    setSelected(car);
    setForm({
      brand: car.brand || "",
      model: car.model || "",
      carType: car.carType || "",
      fuelType: car.fuelType || "",
      seats: car.seats ?? 4,
      transmission: car.transmission || "Auto",
      pricePerDay: car.pricePerDay ?? 0,
      imageUrl: car.imageUrl || "",
    });
    setOpen(true);
    setMsg("");
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const saveCar = async () => {
    setMsg("");

    if (!form.brand.trim() || !form.model.trim()) {
      setMsg("❌ Brand and Model required");
      return;
    }
    if (Number(form.pricePerDay) <= 0) {
      setMsg("❌ Price per day must be greater than 0");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        seats: Number(form.seats),
        pricePerDay: Number(form.pricePerDay),
      };

      if (mode === "ADD") {
        await addCarAdmin(payload);
        setMsg("✅ Car added");
      } else {
        await updateCarAdmin(selected.carId, payload);
        setMsg("✅ Car updated");
      }

      setOpen(false);
      loadCars();
    } catch (e) {
      setMsg(e?.response?.data || "❌ Save failed");
    } finally {
      setSaving(false);
    }
  };

  const removeCar = async (carId) => {
    if (!confirm("Delete this car?")) return;

    try {
      await deleteCarAdmin(carId);
      setMsg("✅ Car deleted");
      loadCars();
    } catch (e) {
      setMsg(e?.response?.data || "❌ Delete failed");
    }
  };

  const changeStatus = async (carId, status) => {
    try {
      await updateCarStatusAdmin(carId, status);
      setMsg("✅ Status updated");
      loadCars();
    } catch (e) {
      setMsg(e?.response?.data || "❌ Status update failed");
    }
  };

  return (
    <main className="container section">
      <div className="ac-top">
        <div>
          <h2 className="page-title">Admin Cars</h2>
          <p className="page-sub">Add, update, delete and manage car status.</p>
        </div>

        <div className="ac-tools">
          <input
            className="ac-search"
            placeholder="Search cars..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="ac-add" onClick={openAdd}>
            + Add Car
          </button>
        </div>
      </div>

      {msg && <p className="ac-note">{msg}</p>}

      {loading ? (
        <p className="muted2">Loading cars...</p>
      ) : filteredCars.length === 0 ? (
        <p className="muted2">No cars found.</p>
      ) : (
        <section className="ac-grid">
          {filteredCars.map((c) => (
            <article className="ac-item card" key={c.carId}>
              <div className="ac-img">
                <img
                  src={
                    c.imageUrl && c.imageUrl.trim()
                      ? c.imageUrl
                      : "/assets/car-default.jpg"
                  }
                  onError={(e) =>
                    (e.currentTarget.src = "/assets/car-default.jpg")
                  }
                  alt={`${c.brand} ${c.model}`}
                />
              </div>

              <div className="ac-main">
                <div className="ac-head">
                  <h3 className="ac-title">
                    {c.brand} {c.model}
                  </h3>
                  <span className={`ac-status ${String(c.status).toLowerCase()}`}>
                    {c.status}
                  </span>
                </div>

                <p className="ac-sub">
                  {c.carType} • {c.fuelType} • {c.transmission} • {c.seats} seats
                </p>

                <p className="ac-price">
                  Rs. <b>{c.pricePerDay}</b> / day
                </p>

                <div className="ac-row">
                  <select
                    className="ac-select"
                    value={c.status}
                    onChange={(e) => changeStatus(c.carId, e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>

                  <button className="ac-btn" onClick={() => openEdit(c)}>
                    Edit
                  </button>

                  <button
                    className="ac-btn danger"
                    onClick={() => removeCar(c.carId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* modal add/edit */}
      <Modal
        open={open}
        title={mode === "ADD" ? "Add New Car" : "Edit Car"}
        onClose={() => setOpen(false)}
      >
        <div className="ac-form">
          <div className="ac-f-row">
            <label>Brand</label>
            <input name="brand" value={form.brand} onChange={onChange} />
          </div>

          <div className="ac-f-row">
            <label>Model</label>
            <input name="model" value={form.model} onChange={onChange} />
          </div>

          <div className="ac-f-row">
            <label>Car Type</label>
            <input name="carType" value={form.carType} onChange={onChange} />
          </div>

          <div className="ac-f-row">
            <label>Fuel Type</label>
            <input name="fuelType" value={form.fuelType} onChange={onChange} />
          </div>

          <div className="ac-f-row">
            <label>Seats</label>
            <input
              type="number"
              min="1"
              name="seats"
              value={form.seats}
              onChange={onChange}
            />
          </div>

          <div className="ac-f-row">
            <label>Transmission</label>
            <input
              name="transmission"
              value={form.transmission}
              onChange={onChange}
            />
          </div>

          <div className="ac-f-row">
            <label>Price/Day</label>
            <input
              type="number"
              min="1"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={onChange}
            />
          </div>

          <div className="ac-f-row">
            <label>Image URL</label>
            <input name="imageUrl" value={form.imageUrl} onChange={onChange} />
          </div>

          {msg && <p className="ac-note">{msg}</p>}

          <button className="ac-save" onClick={saveCar} disabled={saving}>
            {saving ? "Saving..." : mode === "ADD" ? "Add Car" : "Update Car"}
          </button>
        </div>
      </Modal>
    </main>
  );
}
