import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("drivehub_token");
    const savedRole = localStorage.getItem("drivehub_role");

    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const login = (jwtToken, userRole) => {
    setToken(jwtToken);
    setRole(userRole);

    localStorage.setItem("drivehub_token", jwtToken);
    localStorage.setItem("drivehub_role", userRole);
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    localStorage.removeItem("drivehub_token");
    localStorage.removeItem("drivehub_role");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        isLoggedIn: !!token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
