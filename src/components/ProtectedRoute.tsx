import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primero, obtener la cookie CSRF
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });

        // Luego, verificar si el usuario está autenticado
        const res = await fetch("http://localhost:8000/user", {
          credentials: "include",
          headers: { Accept: "application/json" },
        });

        if (res.status === 200) {
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return <div>Cargando...</div>;

  return isAuth ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
