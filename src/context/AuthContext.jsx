import { createContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isLoggedIn = !!role;

  const loadMe = async () => {
    try {
      const res = await axiosInstance.get("/auth/me");
      setRole(res.data.role); // { email, role }
      return res.data;
    } catch (e) {
      setRole(null);
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      await loadMe();
      setIsLoading(false);
    })();
  }, []);

  const login = async (email, password) => {
  await axiosInstance.post("/auth/login", { email, password });
  const me = await axiosInstance.get("/auth/me"); // ✅ MUST
  setRole(me.data.role);
  return me.data;
};
  const logout = async () => {
    await axiosInstance.post("/auth/logout");
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ role, isLoggedIn, isLoading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
