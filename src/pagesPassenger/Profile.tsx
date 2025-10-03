import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PhoneField from "../components/PhoneField";
import "../styles/Profile.module.css";

interface Profile {
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  dni?: string;
  birth_date?: string;
  address?: string;
  phone_country_code?: string;
  phone_area_code?: string;
  phone_number?: string;
  emergency_country_code?: string;
  emergency_area_code?: string;
  emergency_number?: string;
}

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const getCsrfToken = () => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1];
    return cookieValue ? decodeURIComponent(cookieValue) : null;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        await fetch("http://localhost:8000/sanctum/csrf-cookie", {
          credentials: "include",
        });
        const res = await fetch("http://localhost:8000/api/profile", {
          //

          credentials: "include",
        });
        if (!res.ok) throw new Error("No se pudo cargar el perfil");
        const data = await res.json();
        if (data.status === "ok") setProfile(data.data);
      } catch (err: any) {
        setError(err.message || "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhoneChange = (
    fieldPrefix: "phone" | "emergency",
    country: string,
    area: string,
    num: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [`${fieldPrefix}_country_code`]: country,
      [`${fieldPrefix}_area_code`]: area,
      [`${fieldPrefix}_number`]: num,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const csrfToken = getCsrfToken();
      console.log("Datos a enviar:", profile);
      const res = await fetch("http://localhost:8000/api/profile", {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": csrfToken || "",
        },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("No se pudo guardar el perfil");
      const data = await res.json();
      if (data.status === "ok") {
        setProfile(data.data);
        setSuccess("Perfil guardado correctamente");
      } else throw new Error(data.message || "Error desconocido");
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div>
      <button onClick={() => navigate("/main-passenger")}>
        <ArrowLeft size={20} /> Volver
      </button>

      <h1>Perfil del usuario</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={profile.first_name || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={profile.last_name || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>DNI:</label>
          <input
            type="text"
            name="dni"
            value={profile.dni || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Fecha de nacimiento:</label>
          <input
            type="date"
            name="birth_date"
            value={profile.birth_date || ""}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Dirección:</label>
          <input
            type="text"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
          />
        </div>

        <PhoneField
          label="Teléfono"
          countryCode={profile.phone_country_code}
          areaCode={profile.phone_area_code}
          number={profile.phone_number}
          onChange={(c, a, n) => handlePhoneChange("phone", c, a, n)}
        />

        <PhoneField
          label="Contacto de emergencia"
          countryCode={profile.emergency_country_code}
          areaCode={profile.emergency_area_code}
          number={profile.emergency_number}
          onChange={(c, a, n) => handlePhoneChange("emergency", c, a, n)}
        />

        <div>
          <button type="button" onClick={() => navigate("/change-password")}>
            Cambiar contraseña
          </button>
          <button type="submit" disabled={saving}>
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
