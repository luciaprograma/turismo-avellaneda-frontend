import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/FormBase.module.css";

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Ingrese un correo válido");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:8000/api/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        setMessage("Error del servidor: " + response.status);
        setLoading(false);
        return;
      }

      const data = await response.json();
      setMessage(
        data.message ||
          "Si el correo ingresado está registrado, se ha enviado un enlace para restablecer la contraseña."
      );

      setButtonDisabled(true);
      setTimeout(() => setButtonDisabled(false), 45000);
      setEmail("");
    } catch (err) {
      console.error(err);
      setMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Recuperar Contraseña</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.labelLarge}`}>
            Correo:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading || buttonDisabled}
          className={styles.button}
        >
          {loading ? "Enviando..." : "Enviar enlace"}
        </button>
      </form>

      {message && (
        <div
          className={`${styles.message} ${
            message.toLowerCase().includes("error")
              ? styles.error
              : styles.success
          }`}
        >
          {message}
        </div>
      )}

      <div className={styles.links}>
        <button onClick={() => navigate("/")} className={styles.linkButton}>
          Volver al login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
