import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "../styles/FormBase.module.css";

const EmailVerified: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verificando...");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<"success" | "error" | "loading">(
    "loading"
  );

  useEffect(() => {
    const id = searchParams.get("id");
    const hash = searchParams.get("hash");
    const expires = searchParams.get("expires");
    const signature = searchParams.get("signature");

    if (!id || !hash || !expires || !signature) {
      setMessage("Link de verificación inválido. Faltan parámetros.");
      setStatus("error");
      setLoading(false);
      return;
    }

    const url = `http://127.0.0.1:8000/api/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

    fetch(url, { method: "GET", credentials: "include" })
      .then(async (res) => {
        if (res.ok) {
          setMessage(
            "¡Correo verificado con éxito! En unos segundos serás redirigido a la página principal."
          );
          setStatus("success");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          const data = await res.json().catch(() => ({}));
          setMessage(
            data.message ||
              "No se pudo verificar el correo. Verificación fallida, volvé a intentarlo."
          );
          setStatus("error");
        }
      })
      .catch((err) => {
        console.error(err);
        setMessage(
          "Error al conectar con el servidor. Intentá nuevamente más tarde."
        );
        setStatus("error");
      })
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Verificación de Correo</h1>
      <p
        className={
          loading
            ? styles.loading
            : status === "success"
            ? styles.success
            : styles.error
        }
      >
        {loading ? "Cargando..." : message}
      </p>
    </div>
  );
};

export default EmailVerified;
