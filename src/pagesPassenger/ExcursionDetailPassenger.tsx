import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/ExcursionDetailPassenger.module.css";

interface ExcursionDate {
  id: number;
  date: string;
  time: string;
  capacity: number;
  price: number;
}

interface ExcursionDetail {
  id: number;
  name: string;
  description: string;
  dates: ExcursionDate[];
}

const DetailExcursionPassenger: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [excursion, setExcursion] = useState<ExcursionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        // Primero asegurarse de tener la cookie CSRF
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`http://localhost:8000/api/excursions/${id}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("No se pudo cargar la excursión");

        const data = await res.json();
        setExcursion(data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchExcursion();
  }, [id]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (!excursion) return <p>No se encontró la excursión.</p>;

  return (
    <div className={styles.detailContainer}>
      <h1 className={styles.title}>{excursion.name}</h1>
      <p className={styles.description}>{excursion.description}</p>

      {excursion.dates.map((d) => (
        <div key={d.id} className={styles.dateCard}>
          <p>
            Costo: <strong>{d.price} ARS</strong>
          </p>
          <p>
            Día y hora: {new Date(d.date).toLocaleDateString()} - {d.time}
          </p>
          <p>Lugar: (pendiente backend)</p>

          <div className={styles.links}>
            <a href={`/pago/${d.id}`}>Informar un pago</a>
            <a href={`/comprobantes/${d.id}`}>Mis comprobantes</a>
          </div>

          <div className={styles.buttons}>
            <button>Descargar</button>
            <button>Cargar más</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailExcursionPassenger;
