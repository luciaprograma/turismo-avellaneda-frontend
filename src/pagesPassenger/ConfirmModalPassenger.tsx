import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ConfirmModalPassenger.module.css";

interface ExcursionDate {
  id: number;
  date: string;
  time: string;
  capacity: number;
  price: number;
}

interface ConfirmModalProps {
  excursionName: string;
  date: ExcursionDate | null;
  onClose: () => void;
}

const ConfirmModalPassenger: React.FC<ConfirmModalProps> = ({
  excursionName,
  date,
  onClose,
}) => {
  const navigate = useNavigate();

  if (!date) return null;

  const handleConfirm = async () => {
    try {
      // Obtener token CSRF
      const getCsrfToken = () => {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      };

      const csrfToken = getCsrfToken();

      const res = await fetch("http://localhost:8000/excursions/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          excursion_date_id: date.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Inscripción realizada correctamente!");
        onClose();
        navigate("/main-passenger"); // solo navega si éxito
      } else {
        alert(data.message);
        onClose(); // cerrar modal aunque haya error
      }
    } catch (err) {
      alert("Error al registrar la excursión. Intente nuevamente.");
      onClose(); // cerrar modal en caso de error inesperado
    }
  };

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContent}>
        <h2>Confirmar inscripción</h2>
        <p>
          Usted está por inscribirse a la excursión{" "}
          <strong>{excursionName}</strong> <br />
          el día <strong>{new Date(date.date).toLocaleDateString()}</strong> a
          la hora <strong>{date.time}</strong>.
        </p>
        <div className={styles.modalButtons}>
          <button onClick={onClose}>Cancelar</button>
          <button onClick={handleConfirm}>Aceptar</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModalPassenger;
