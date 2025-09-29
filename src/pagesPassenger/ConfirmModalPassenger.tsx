import React from "react";
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
  if (!date) return null;

  const handleConfirm = async () => {
    try {
      // Obtener el token CSRF de la cookie
      const getCsrfToken = () => {
        const cookieValue = document.cookie
          .split("; ")
          .find((row) => row.startsWith("XSRF-TOKEN="))
          ?.split("=")[1];
        return cookieValue ? decodeURIComponent(cookieValue) : null;
      };

      const csrfToken = getCsrfToken();

      const res = await fetch("http://localhost:8000/api/excursions/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify({
          excursion_date_id: date.id, // <--- corregido para coincidir con backend
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert("Inscripción realizada correctamente!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Error al registrar la excursión. Intente nuevamente.");
    }

    onClose();
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
