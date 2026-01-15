import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // ✅ restore session after refresh
    const t = localStorage.getItem("drivehub_token");
    const r = localStorage.getItem("drivehub_role");

    if (t) setToken(t);
    if (r) setRole(r);

    setIsLoading(false);
  }, []);

  const login = (newToken, newRole) => {
    localStorage.setItem("drivehub_token", newToken);
    localStorage.setItem("drivehub_role", newRole);

    setToken(newToken);
    setRole(newRole);
  };

  const logout = () => {
    localStorage.removeItem("drivehub_token");
    localStorage.removeItem("drivehub_role");

    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isLoggedIn: !!token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
