import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/FormBase.module.css";

const VerifyEmail: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleVerify = async () => {
    if (!email.includes("@") || !email.includes(".")) {
      setMessage("Ingrese un correo válido");
      return;
    }
    if (password !== repeatPassword) {
      setMessage("Las contraseñas no coinciden");
      return;
    }
    if (password.length < 4) {
      setMessage("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://127.0.0.1:8000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: repeatPassword,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok) {
        setMessage(
          data.message ||
            "Usuario creado. Revisá tu correo para verificar el email."
        );
        setEmail("");
        setPassword("");
        setRepeatPassword("");

        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        if (data.errors) {
          const errorMessages = Object.values(data.errors).flat().join("\n");
          setMessage(errorMessages);
        } else if (data.message) {
          setMessage(data.message);
        } else {
          setMessage("Ocurrió un error desconocido.");
        }
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Registro</h1>

      <div className={styles.field}>
        <label className={styles.label}>Correo:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Contraseña:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Repetir Contraseña:</label>
        <input
          type="password"
          value={repeatPassword}
          onChange={(e) => setRepeatPassword(e.target.value)}
          className={styles.input}
        />
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Enviando..." : "Enviar Enlace"}
      </button>

      {message && <div className={styles.message}>{message}</div>}
    </div>
  );
};

export default VerifyEmail;
