import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import "../../styles/utilities.css";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, role } = useAuth(); // ✅ role from context after login
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      setMsg("");
      setLoading(true);

      const user = await login(form.email, form.password);

      if (user?.role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/cars");

    } catch (err) {
      if (err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
        setMsg("⏳ Server is slow. Please wait and try again.");
      } else if (!err.response) {
        setMsg("❌ Server not responding. Try again.");
      } else if (err.response.status === 401 || err.response.status === 403) {
        setMsg("❌ Invalid email or password");
      } else {
        setMsg("❌ Login failed. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container section auth">
      <div className="card auth-card">
        <h2>Login</h2>
        <p className="muted">Welcome back to DriveHub.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            value={form.email}
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
            {loading ? "Signing in..." : "Login"}
          </button>

          {msg && <p className="auth-msg">{msg}</p>}

          <p className="auth-link">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
