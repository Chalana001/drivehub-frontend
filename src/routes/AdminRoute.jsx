import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function AdminRoute({ children }) {
  const { isLoggedIn, role } = useAuth();

  if (!isLoggedIn) return <Navigate to="/login" replace />;
  if (role !== "ADMIN") return <Navigate to="/unauthorized" replace />;

  return children;
}
