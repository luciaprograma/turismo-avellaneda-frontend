import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "../styles/FormBase.module.css";

const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password || !passwordConfirm) {
      setMessage("Por favor completá todos los campos");
      return;
    }

    if (password !== passwordConfirm) {
      setMessage("Las contraseñas no coinciden");
      return;
    }

    if (!token) {
      setMessage("Token inválido o expirado");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          password_confirmation: passwordConfirm,
          token,
        }),
      });

      if (!response.ok) {
        if (response.status === 419) {
          setMessage(
            "Error de autenticación. Recarga la página e intenta de nuevo."
          );
          return;
        }

        if (response.status === 422) {
          try {
            const errorData = await response.json();
            const errors = errorData.errors;
            if (errors) {
              const firstError = Object.values(errors)[0] as string[];
              setMessage(firstError[0] || "Error de validación");
            } else {
              setMessage(errorData.message || "Error de validación");
            }
          } catch {
            setMessage("Error de validación");
          }
          return;
        }

        try {
          const errorData = await response.json();
          setMessage(errorData.message || "Error del servidor");
        } catch {
          setMessage(`Error del servidor: ${response.status}`);
        }
        return;
      }

      const data = await response.json();
      setMessage(
        data.message ||
          "Si el token y el correo son correctos, la contraseña ha sido restablecida, serás redirigido al Inicio."
      );

      setButtonDisabled(true);
      setTimeout(() => setButtonDisabled(false), 45000);
      setEmail("");
      setPassword("");
      setPasswordConfirm("");

      setTimeout(() => navigate("/"), 5000);
    } catch (err) {
      console.error("Error completo:", err);
      setMessage("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Restablecer Contraseña</h1>

      <form onSubmit={handleSubmit}>
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
          <label className={styles.label}>Nueva Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirmar Contraseña:</label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading || buttonDisabled}
          className={styles.button}
        >
          {loading ? "Restableciendo..." : "Restablecer Contraseña"}
        </button>
      </form>

      {message && <div className={styles.message}>{message}</div>}

      <div className={styles.links}>
        <button onClick={() => navigate("/")} className={styles.linkButton}>
          Volver al login
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
