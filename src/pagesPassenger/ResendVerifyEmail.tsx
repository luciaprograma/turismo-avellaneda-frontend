import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "../styles/FormBase.module.css";

const ResendVerifyEmail: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResend = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Ingrese un correo válido");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/email/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(
          data.message ||
            "Si tu correo está registrado, recibirás un nuevo link de verificación. Rediriigiendo al inicio de sesión..."
        );
        setEmail("");

        setTimeout(() => {
          navigate("/", { replace: true });
        }, 2500);
      } else {
        const errorMessages = data.errors
          ? Object.values(data.errors).flat().join("\n")
          : data.message || "Ocurrió un error desconocido.";
        setMessage(errorMessages);
      }
    } catch (error) {
      console.error(error);
      setMessage("Error al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Reenviar Link de Verificación</h1>

      <div className={styles.field}>
        <label className={styles.label}>Correo:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <button
        onClick={handleResend}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Enviando..." : "Reenviar Link"}
      </button>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default ResendVerifyEmail;
