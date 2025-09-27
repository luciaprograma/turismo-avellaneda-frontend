// frontend/src/components/ProtectedRoute.tsx
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
        const res = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
        });
        setIsAuth(res.ok);
      } catch (err) {
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAuth ? <>{children}</> : <Navigate to="/" />;
};

export default ProtectedRoute;
