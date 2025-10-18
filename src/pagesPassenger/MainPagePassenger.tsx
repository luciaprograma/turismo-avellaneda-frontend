import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/MainPagePassenger.module.css";
import PassengerMenuBar from "./PassengerMenuBar";
import { getAllExcursions } from "../api";

interface Excursion {
  id: number;
  name: string;
  description: string;
}

const colors = ["#0F9D58", "#AB47BC", "#DB4437", "#F4B400", "#4285F4"];

const MainPagePassenger: React.FC = () => {
  const [excursiones, setExcursiones] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExcursiones = async () => {
      try {
        const response = await getAllExcursions();
        const data = await response.json();

        if (response.ok && data.success) {
          setExcursiones(Array.isArray(data.data.data) ? data.data.data : []);
        } else {
          setError(data.message || "No se pudieron cargar las excursiones");
        }
      } catch (err) {
        setError("Error de conexión con el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchExcursiones();
  }, []);

  if (loading) return <p>Cargando excursiones...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles["main-container"]}>
      <PassengerMenuBar />

      <h1>Excursiones Disponibles</h1>
      <div className={styles["cards-grid"]}>
        {excursiones.map((excursion, index) => {
          const color = colors[index % colors.length];
          return (
            <div
              key={index}
              className={styles.card}
              style={{ backgroundColor: color }}
              onClick={() => navigate(`/excursion/${excursion.id}`)}
            >
              <h2>{excursion.name}</h2>
              <p>{excursion.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MainPagePassenger;
