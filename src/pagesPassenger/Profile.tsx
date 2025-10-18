import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PhoneField from "../components/PhoneField";
import styles from "../styles/FormBase.module.css";
import { getProfile, updateProfile } from "../api";

interface Profile {
  id?: number;
  user_id?: number;
  first_name?: string;
  last_name?: string;
  dni?: number;
  birth_date?: string;
  address?: string;
  phone_country_code?: number;
  phone_area_code?: string;
  phone_number?: number;
  emergency_country_code?: number;
  emergency_area_code?: string;
  emergency_number?: number;
}

const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();

        if (!response.ok) throw new Error("No se pudo cargar el perfil");
        const data = await response.json();
        if (data.status === "ok") setProfile(data.data);
        else throw new Error(data.message || "Error desconocido");
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
    country: number | null,
    area: string,
    num: number | null
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
      const isUpdate = !!profile.id;

      const response = await updateProfile(profile);

      if (!response.ok) throw new Error("No se pudo guardar el perfil");
      const data = await response.json();

      if (data.status === "ok") {
        setProfile(data.data);
        setSuccess(
          isUpdate
            ? "Perfil actualizado correctamente"
            : "Perfil creado correctamente"
        );

        setTimeout(() => {
          navigate("/main-passenger");
        }, 2000);
      } else throw new Error(data.message || "Error desconocido");
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al guardar el perfil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div className={styles.container}>
      <button
        className={styles.linkButton}
        onClick={() => navigate("/main-passenger")}
      >
        <ArrowLeft size={20} /> Volver
      </button>

      <h1 className={styles.title}>Perfil del usuario</h1>

      {error && <p className={`${styles.message} ${styles.error}`}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className={styles.field}>
          <label className={styles.label}>Nombre:</label>
          <input
            type="text"
            name="first_name"
            value={profile.first_name || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Apellido:</label>
          <input
            type="text"
            name="last_name"
            value={profile.last_name || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>DNI:</label>
          <input
            type="text"
            name="dni"
            value={profile.dni || ""}
            onChange={handleChange}
            className={styles.input}
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={15}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Fecha de nacimiento:</label>
          <input
            type="date"
            name="birth_date"
            value={profile.birth_date || ""}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Dirección:</label>
          <input
            type="text"
            name="address"
            value={profile.address || ""}
            onChange={handleChange}
            className={styles.input}
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

        <button type="submit" className={styles.button} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </button>

        {success && (
          <p className={`${styles.message} ${styles.success}`}>{success}</p>
        )}

        <button
          type="button"
          className={styles.linkButton}
          onClick={() => navigate("/change-password")}
        >
          Cambiar contraseña
        </button>
      </form>
    </div>
  );
};

export default ProfileForm;
