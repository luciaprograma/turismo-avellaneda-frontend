import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/FormBase.module.css";
import { uploadPaymentReceipt } from "../api";

const InformPayment: React.FC = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams<{ registrationId: string }>();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Por favor seleccione un archivo");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const response = await uploadPaymentReceipt(
        parseInt(registrationId!),
        selectedFile
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Error al subir el comprobante");
      }

      setSuccess(true);
      setSelectedFile(null);

      setTimeout(() => {
        navigate("/mis-excursiones");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Error al subir el archivo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <button
        className={styles.linkButton}
        onClick={() => navigate("/mis-excursiones")}
        style={{ alignSelf: "flex-start", marginBottom: "20px" }}
      >
        <ArrowLeft
          size={20}
          style={{ verticalAlign: "middle", marginRight: "5px" }}
        />
        Volver
      </button>

      <h1 className={styles.title}>Informar Pago</h1>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      {success && (
        <p className={`${styles.message} ${styles.success}`}>
          ¡Comprobante subido exitosamente! Redirigiendo...
        </p>
      )}

      <form onSubmit={handleUpload}>
        <div className={styles.field}>
          <label className={styles.label}>
            Comprobante de pago (PDF, JPG o PNG - máx. 5MB)
          </label>

          <label htmlFor="file-upload" className={styles.fileLabel}>
            {selectedFile ? selectedFile.name : "Seleccionar archivo"}
          </label>

          <input
            id="file-upload"
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileChange}
            disabled={uploading}
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
          disabled={!selectedFile || uploading}
          className={styles.button}
        >
          {uploading ? "Subiendo..." : "Subir Comprobante"}
        </button>
      </form>
    </div>
  );
};

export default InformPayment;
