import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from "../styles/FormBase.module.css";
import { changePassword } from "../api";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const response = await changePassword(newPassword, confirmPassword);
      const data = await response.json();

      if (response.ok) {
        setStatus("success");
        setMessage(data.message || "Contraseña actualizada correctamente.");
        setTimeout(() => {
          navigate("/main-passenger");
        }, 2000);
      } else {
        setStatus("error");
        setMessage(data.message || "Error al actualizar la contraseña.");
      }
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Error de conexión con el servidor.");
    }
  };

  return (
    <div className={styles.container}>
      <button
        onClick={() => navigate(-1)}
        className={styles.linkButton}
        style={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
      >
        <ArrowLeft size={20} />
        <span style={{ marginLeft: "0.5rem" }}>Volver</span>
      </button>

      <h1 className={styles.title}>Cambiar contraseña</h1>

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Nueva contraseña</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Confirmar nueva contraseña</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.input}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Actualizando..." : "Cambiar contraseña"}
        </button>
      </form>

      {message && (
        <p
          className={
            status === "success"
              ? styles.success
              : status === "error"
              ? styles.error
              : styles.message
          }
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default ChangePassword;
