import React, { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/FormBase.module.css";
import { registerExcursion, uploadPaymentReceipt } from "../api";

interface ExcursionData {
  excursionId: number;
  excursionName: string;
  date: {
    id: number;
    date: string;
    time: string;
    price: number;
  };
  location?: string;
}

const CheckoutExcursion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const excursionData = location.state as ExcursionData;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!excursionData) {
    return (
      <div className={styles.container}>
        <p className={`${styles.message} ${styles.error}`}>
          Error: No se encontraron datos de la excursión
        </p>
        <button
          onClick={() => navigate("/main-passenger")}
          className={styles.button}
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  const {
    excursionName,
    date,
    location: excursionLocation,
    excursionId,
  } = excursionData;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const validTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];
    if (!validTypes.includes(file.type)) {
      setError("Solo se permiten archivos PDF, JPG y PNG");
      setSelectedFile(null);
      return;
    }

    if (file.size > 5242880) {
      setError("El archivo no puede superar los 5MB");
      setSelectedFile(null);
      return;
    }

    setError(null);
    setSelectedFile(file);
  };

  const uploadPayment = async (registrationId: number) => {
    if (!selectedFile) return true;

    try {
      const response = await uploadPaymentReceipt(registrationId, selectedFile);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al subir el comprobante");
      }

      return true;
    } catch (err: any) {
      throw new Error(err.message || "Error al subir el archivo");
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      // CAMBIADO: Usa función centralizada
      const response = await registerExcursion(date.id);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Error al crear la inscripción");
      }

      if (!data.registration_id && !data.data?.id) {
        throw new Error("No se pudo obtener el ID del registro");
      }

      const registrationId = data.registration_id || data.data?.id;

      if (selectedFile) {
        await uploadPayment(registrationId);
      }

      setSuccess(true);

      setTimeout(() => {
        navigate(`/excursion/${excursionId}`, { replace: true });
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al procesar la compra");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.linkButton}
        onClick={() => navigate(-1)}
        style={{ alignSelf: "flex-start", marginBottom: "20px" }}
      >
        <ArrowLeft
          size={20}
          style={{ verticalAlign: "middle", marginRight: "5px" }}
        />
        Volver
      </button>

      <h1 className={styles.title}>Confirmar Compra</h1>

      <div
        className={styles.field}
        style={{
          background: "#f5f5f5",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: "1.2em" }}>
          Resumen de la compra
        </h2>
        <p>
          <strong>Excursión:</strong> {excursionName}
        </p>
        <p>
          <strong>Fecha:</strong> {new Date(date.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Hora:</strong> {date.time}
        </p>
        {excursionLocation && (
          <p>
            <strong>Lugar:</strong> {excursionLocation}
          </p>
        )}
        <p style={{ fontSize: "1.3em", marginTop: "15px" }}>
          <strong>Total: ${date.price} ARS</strong>
        </p>
      </div>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      {success && (
        <p className={`${styles.message} ${styles.success}`}>
          {selectedFile
            ? "¡Compra realizada y comprobante subido exitosamente! Redirigiendo..."
            : "¡Compra realizada exitosamente! Redirigiendo..."}
        </p>
      )}

      <form onSubmit={handleCheckout}>
        <div className={styles.field}>
          <label className={styles.label}>
            Comprobante de pago (Opcional - PDF, JPG o PNG - máx. 5MB)
          </label>

          <label htmlFor="file-upload" className={styles.fileLabel}>
            {selectedFile ? selectedFile.name : "Seleccionar archivo"}
          </label>

          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={uploading || success}
            style={{ display: "none" }}
          />
        </div>

        {selectedFile && (
          <div className={styles.fileInfo}>
            <p>
              <strong>Archivo:</strong> {selectedFile.name}
            </p>
            <p>
              <strong>Tamaño:</strong> {(selectedFile.size / 1024).toFixed(2)}{" "}
              KB
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={uploading || success}
          className={styles.button}
        >
          {uploading ? "Procesando compra..." : "Confirmar Compra"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutExcursion;
