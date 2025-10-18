import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/ExcursionDetailPassenger.module.css";
import { getExcursionDetails } from "../api";

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
  location?: string;
  dates: ExcursionDate[];
}

const DetailExcursionPassenger: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [excursion, setExcursion] = useState<ExcursionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        const response = await getExcursionDetails(id!);

        if (!response.ok) throw new Error("No se pudo cargar la excursión");

        const data = await response.json();
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
      <button
        className={styles.backButton}
        onClick={() => navigate("/main-passenger")}
      >
        <ArrowLeft size={20} /> Volver
      </button>

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
          <p>Lugar: {excursion.location || "No especificado"}</p>

          <div className={styles.buttons}>
            <button
              onClick={() => {
                navigate(`/checkout/${d.id}`, {
                  state: {
                    excursionId: excursion.id,
                    excursionName: excursion.name,
                    date: d,
                    location: excursion.location,
                  },
                });
              }}
            >
              Comprar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DetailExcursionPassenger;
