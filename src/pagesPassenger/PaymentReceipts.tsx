import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Download, Eye } from "lucide-react";
import styles from "../styles/FormBase.module.css";

interface Payment {
  id: number;
  registration_id: number;
  receipt_url: string;
  receipt_filename: string;
  status: number;
  uploaded_at: string;
  original_file_name: string;
  mime_type: string;
  file_size: number;
}

const PaymentReceipts: React.FC = () => {
  const navigate = useNavigate();
  const { registrationId } = useParams<{ registrationId: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        const res = await fetch(
          `http://localhost:8000/api/payments/registration/${registrationId}`,
          {
            credentials: "include",
            headers: {
              Accept: "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error("Error al cargar comprobantes");
        }

        const data = await res.json();

        if (data.success) {
          setPayments(data.data);
        } else {
          setError(data.message || "Error desconocido");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    if (registrationId) {
      fetchPayments();
    }
  }, [registrationId]);

  const getStatusText = (status: number): string => {
    if (status === 0) return "Pendiente";
    if (status === 1) return "Aprobado";
    if (status === 2) return "Rechazado";
    return "Desconocido";
  };

  const getStatusColor = (status: number): string => {
    if (status === 0) return "#f59e0b";
    if (status === 1) return "#10b981";
    if (status === 2) return "#ef4444";
    return "#6b7280";
  };

  const isImage = (mimeType: string): boolean => {
    return mimeType.startsWith("image/");
  };

  const isPDF = (mimeType: string): boolean => {
    return mimeType === "application/pdf";
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1048576).toFixed(1) + " MB";
  };

  const handleView = (paymentId: number) => {
    window.open(
      `http://localhost:8000/api/payments/${paymentId}/view`,
      "_blank"
    );
  };

  const handleDownload = async (paymentId: number, fileName: string) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/payments/${paymentId}/download`,
        {
          credentials: "include",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Error al descargar el archivo");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading file:", err);
      alert("Error al descargar el archivo");
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={`${styles.message} ${styles.loading}`}>Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className={`${styles.message} ${styles.error}`}>{error}</p>
        <button
          className={styles.button}
          onClick={() => navigate("/mis-excursiones")}
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.linkButton}
        onClick={() => navigate("/mis-excursiones")}
        style={{ marginBottom: "20px" }}
      >
        <ArrowLeft size={20} style={{ marginRight: "8px" }} />
        Volver
      </button>

      <h1 className={styles.title}>Mis Comprobantes</h1>

      {payments.length === 0 ? (
        <p className={styles.message}>No has subido comprobantes aún</p>
      ) : (
        <div style={{ width: "100%" }}>
          {payments.map((payment) => (
            <div key={payment.id} className={styles.field}>
              {isImage(payment.mime_type) && (
                <div style={{ marginBottom: "12px" }}>
                  <img
                    src={`http://localhost:8000/api/payments/${payment.id}/view`}
                    alt={payment.original_file_name}
                    style={{
                      width: "100%",
                      maxHeight: "300px",
                      objectFit: "contain",
                      borderRadius: "10px",
                      border: "1px solid #ccc",
                      cursor: "pointer",
                    }}
                    onClick={() => handleView(payment.id)}
                  />
                </div>
              )}

              {isPDF(payment.mime_type) && (
                <div
                  style={{
                    marginBottom: "12px",
                    padding: "40px",
                    backgroundColor: "#f3f4f6",
                    borderRadius: "10px",
                    border: "1px solid #ccc",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  onClick={() => handleView(payment.id)}
                >
                  <FileText size={64} color="#ef4444" />
                  <p style={{ marginTop: "12px", fontWeight: "600" }}>
                    Documento PDF
                  </p>
                  <p style={{ fontSize: "14px", color: "#6b7280" }}>
                    Click para ver
                  </p>
                </div>
              )}

              <div className={styles.fileInfo}>
                <p>
                  <strong>Archivo:</strong> {payment.original_file_name}
                </p>
                <p>
                  <strong>Tamaño:</strong> {formatFileSize(payment.file_size)}
                </p>
                <p>
                  <strong>Estado:</strong>{" "}
                  <span
                    style={{
                      color: getStatusColor(payment.status),
                      fontWeight: "600",
                    }}
                  >
                    {getStatusText(payment.status)}
                  </span>
                </p>
                <p>
                  <strong>Subido:</strong>{" "}
                  {new Date(payment.uploaded_at).toLocaleString("es-AR")}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                <button
                  className={styles.button}
                  onClick={() => handleView(payment.id)}
                  style={{
                    flex: "1",
                    minWidth: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Eye size={18} />
                  Ver
                </button>
                <button
                  className={styles.button}
                  onClick={() =>
                    handleDownload(payment.id, payment.original_file_name)
                  }
                  style={{
                    flex: "1",
                    minWidth: "150px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Download size={18} />
                  Descargar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentReceipts;
