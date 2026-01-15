import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { isLoggedIn, role, isLoading } = useAuth();

  if (isLoading) return <p className="muted2">Loading...</p>;
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return children;
}
