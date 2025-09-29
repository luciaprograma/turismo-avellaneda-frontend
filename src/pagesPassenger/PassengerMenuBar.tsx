import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/PassengerMenuBar.module.css";

const PassengerMenuBar: React.FC = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Obtener el token CSRF (misma función que en login)
      const getCsrfToken = () => {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      };

      const csrfToken = getCsrfToken();

      const response = await fetch("http://localhost:8000/api/logout", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
      });

      if (!response.ok) {
        console.error("Error al cerrar sesión:", response.status);
        return;
      }

      localStorage.removeItem("isAuthenticated");
      navigate("/");
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  return (
    <div className={styles.menuBar}>
      {/* Menú izquierdo */}
      <div className={styles.menuLeft} ref={dropdownRef}>
        <button
          className={styles.menuButton}
          onClick={() => setDropdownOpen((prev) => !prev)}
        >
          ☰
        </button>
        {dropdownOpen && (
          <div className={styles.dropdown}>
            <div
              className={styles.dropdownItem}
              onClick={() => navigate("/datos-personales")}
            >
              Datos Personales
            </div>
            <div className={styles.dropdownItem} onClick={handleLogout}>
              Cerrar Sesión
            </div>
          </div>
        )}
      </div>

      {/* Botón derecho */}
      <div
        className={styles.menuRight}
        onClick={() => navigate("/mis-excursiones")}
      >
        Mis Excursiones
      </div>
    </div>
  );
};

export default PassengerMenuBar;
