import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerCustomer } from "../../api/authApi";
import "../../styles/utilities.css";
import "./RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await registerCustomer(form);
      setMsg("✅ Registered successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      setMsg(err?.response?.data || "❌ Register failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container section auth">
      <div className="card auth-card">
        <h2>Create Account</h2>
        <p className="muted">Luxury rentals start here.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            required
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button className="auth-btn" disabled={loading}>
            {loading ? "Creating..." : "Register"}
          </button>

          {msg && <p className="auth-msg">{msg}</p>}

          <p className="auth-link">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
