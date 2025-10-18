import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/ConfirmModalPassenger.module.css";
import { registerExcursion } from "../api";

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
      const response = await registerExcursion(date.id);
      const data = await response.json();

      if (data.success) {
        alert("Inscripción realizada correctamente!");
        onClose();
        navigate("/main-passenger");
      } else {
        alert(data.message);
        onClose();
      }
    } catch (err) {
      alert("Error al registrar la excursión. Intente nuevamente.");
      onClose();
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
