import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../api/authApi";
import useAuth from "../../hooks/useAuth";
import "../../styles/utilities.css";
import "./LoginPage.css";

export default function LoginPage() {
  const { login } = useAuth();
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
      const res = await loginUser(form);
      const { token, role } = res.data;

      login(token, role);

      // redirect based on role
      if (role === "ADMIN") navigate("/admin/dashboard");
      else navigate("/cars");
    } catch (err) {
      setMsg("❌ Invalid email or password");
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
