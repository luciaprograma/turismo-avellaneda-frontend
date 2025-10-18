import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../styles/FormBase.module.css";
import { loginUser } from "../api";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Por favor completá todos los campos");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await loginUser(email, password);
      const data = await response.json();

      if (response.ok) {
        setMessage("Login exitoso! Redirigiendo...");
        setTimeout(() => navigate("/main-passenger"), 1000);
      } else {
        if (data.reason === "email_unverified") {
          navigate("/resend-verify-email", { state: { email } });
        } else if (data.errors) {
          setMessage(data.errors.email?.[0] || "Error en las credenciales");
        } else {
          setMessage(data.message || "Error al iniciar sesión");
        }
      }
    } catch (error) {
      setMessage("Error al conectar con el servidor");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/verify-email");
  };

  return (
    <div className={styles.container}>
      <h1>Inicio de Sesión</h1>

      <div className={styles.field}>
        <label className={styles.label}>📧 Email:</label>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>🔒 Contraseña:</label>
        <input
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
      </div>

      <button
        onClick={handleLogin}
        disabled={loading}
        className={styles.button}
      >
        {loading ? "Ingresando..." : "Iniciar Sesión"}
      </button>

      <div className={styles.links}>
        <button onClick={handleForgotPassword} className={styles.linkButton}>
          Olvidé mi contraseña
        </button>
        <button onClick={handleRegister} className={styles.linkButton}>
          Registrarme
        </button>
      </div>

      {message && (
        <div
          className={`${styles.message} ${
            message.includes("Error") ? styles.error : styles.success
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default Login;
