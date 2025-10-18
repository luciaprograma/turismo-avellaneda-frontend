import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/ExcursionDetailPassenger.module.css";
import { getMyExcursions } from "../api";

interface Excursion {
  registration_id: number;
  excursion_id: number;
  excursion_name: string;
  location: string;
  date: string;
  time: string;
  price: number;
  status: string;
  registration_date: string;
}

const MyExcursions: React.FC = () => {
  const navigate = useNavigate();
  const [excursions, setExcursions] = useState<Excursion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyExcursions = async () => {
      try {
        const response = await getMyExcursions();

        if (!response.ok)
          throw new Error("No se pudieron cargar las excursiones");

        const data = await response.json();

        if (data.success) {
          setExcursions(data.data);
        } else {
          setError(data.message || "Error al cargar excursiones");
        }
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchMyExcursions();
  }, []);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.detailContainer}>
      <button
        className={styles.backButton}
        onClick={() => navigate("/main-passenger")}
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <h1 className={styles.title}>Mis Excursiones</h1>
      <p className={styles.description}>
        Estas son las excursiones en las que te has inscrito
      </p>

      {excursions.length === 0 ? (
        <p className={styles.description}>No tienes excursiones registradas.</p>
      ) : (
        excursions.map((excursion) => (
          <div key={excursion.registration_id} className={styles.dateCard}>
            <p>
              <strong>{excursion.excursion_name}</strong>
            </p>
            <p>
              Costo: <strong>{excursion.price} ARS</strong>
            </p>
            <p>
              Día y hora: {new Date(excursion.date).toLocaleDateString()} -{" "}
              {excursion.time}
            </p>
            <p>Lugar: {excursion.location || "No especificado"}</p>

            <div className={styles.links}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/informar-pago/${excursion.registration_id}`);
                }}
              >
                Informar pago
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/ver-comprobantes/${excursion.registration_id}`);
                }}
              >
                Ver mis comprobantes
              </a>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyExcursions;
