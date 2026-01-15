import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <p className="muted2">Loading...</p>;

  if (!isLoggedIn) return <Navigate to="/login" replace />;

  return children;
}