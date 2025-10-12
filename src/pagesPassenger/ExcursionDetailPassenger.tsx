import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/ExcursionDetailPassenger.module.css";
import ConfirmModalPassenger from "./ConfirmModalPassenger";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<ExcursionDate | null>(null);

  useEffect(() => {
    const fetchExcursion = async () => {
      try {
        // Obtener cookie CSRF
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(`http://localhost:8000/excursions/${id}`, {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
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
                setSelectedDate(d);
                setIsModalOpen(true);
              }}
            >
              Comprar
            </button>

            <label className={styles.uploadLabel}>
              Informar un pago
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                className={styles.uploadInput}
              />
            </label>
          </div>
        </div>
      ))}

      {isModalOpen && excursion && selectedDate && (
        <ConfirmModalPassenger
          excursionName={excursion.name}
          date={selectedDate}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default DetailExcursionPassenger;
