import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import "./ThemeToggle.css";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button className="theme-btn" onClick={toggleTheme}>
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </button>
  );
}
