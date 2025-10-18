const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Función para obtener el token CSRF
const getCsrfToken = (): string | null => {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("XSRF-TOKEN="))
    ?.split("=")[1];
  return cookieValue ? decodeURIComponent(cookieValue) : null;
};

// Función para obtener la cookie CSRF del servidor
export const fetchCsrfCookie = async (): Promise<void> => {
  await fetch(`${API_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
};

// Función para login
export const loginUser = async (email: string, password: string) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({ email, password }),
  });

  return response;
};

// Función para verificar si el usuario está autenticado
export const checkAuth = async () => {
  await fetchCsrfCookie();

  const response = await fetch(`${API_URL}/user`, {
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  return response;
};

// Función para cambiar contraseña
export const changePassword = async (
  newPassword: string,
  confirmPassword: string
) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/change-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({
      new_password: newPassword,
      new_password_confirmation: confirmPassword,
    }),
  });

  return response;
};

// Función para verificar email
export const verifyEmail = async (email: string, code: string) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/verify-email`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({ email, code }),
  });

  return response;
};

// Función para reenviar código de verificación
export const resendVerificationCode = async (email: string) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/resend-code`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({ email }),
  });

  return response;
};

// Función para solicitar reset de contraseña
export const forgotPassword = async (email: string) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/api/forgot-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({ email }),
  });

  return response;
};

// Función para resetear contraseña
export const resetPassword = async (
  email: string,
  password: string,
  passwordConfirmation: string,
  token: string
) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/api/reset-password`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({
      email,
      password,
      password_confirmation: passwordConfirmation,
      token,
    }),
  });

  return response;
};

// Función para obtener excursiones
export const getExcursions = async () => {
  const response = await fetch(`${API_URL}/excursions/register`, {
    credentials: "include",
  });

  return response;
};

// Función para obtener detalles de una excursión
export const getExcursionDetails = async (id: string) => {
  const response = await fetch(`${API_URL}/excursions/${id}`, {
    credentials: "include",
  });

  return response;
};

// Función para obtener todas las excursiones
export const getAllExcursions = async () => {
  const response = await fetch(`${API_URL}/excursions`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return response;
};

// Función para registrar usuario en una excursión
export const registerExcursion = async (excursionDateId: number) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/excursions/register`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify({
      excursion_date_id: excursionDateId,
    }),
  });

  return response;
};

// Función para obtener perfil del usuario
export const getProfile = async () => {
  await fetchCsrfCookie();

  const response = await fetch(`${API_URL}/profile`, {
    credentials: "include",
  });

  return response;
};

// Función para actualizar perfil del usuario
export const updateProfile = async (profile: any) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const isUpdate = !!profile.id;
  const method = isUpdate ? "PUT" : "POST";

  const response = await fetch(`${API_URL}/profile`, {
    method,
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: JSON.stringify(profile),
  });

  return response;
};

// Función para logout
export const logoutUser = async () => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
  });

  return response;
};

// Función para subir comprobante de pago
export const uploadPaymentReceipt = async (
  registrationId: number,
  file: File
) => {
  await fetchCsrfCookie();

  const csrfToken = getCsrfToken();

  const formData = new FormData();
  formData.append("registration_id", registrationId.toString());
  formData.append("file", file);

  const response = await fetch(`${API_URL}/api/payments/upload`, {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "X-XSRF-TOKEN": csrfToken || "",
    },
    body: formData,
  });

  return response;
};

// Función para obtener las excursiones del usuario
export const getMyExcursions = async () => {
  await fetchCsrfCookie();

  const response = await fetch(`${API_URL}/my-excursions`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  return response;
};
// Función para obtener comprobantes de pago por registration_id
export const getPaymentsByRegistration = async (registrationId: string) => {
  await fetchCsrfCookie();

  const response = await fetch(
    `${API_URL}/api/payments/registration/${registrationId}`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response;
};

// Función para obtener URL de visualización de comprobante
export const getPaymentViewUrl = (paymentId: number): string => {
  return `${API_URL}/api/payments/${paymentId}/view`;
};

// Función para descargar comprobante de pago
export const downloadPaymentReceipt = async (paymentId: number) => {
  const response = await fetch(
    `${API_URL}/api/payments/${paymentId}/download`,
    {
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  return response;
};
// Función para registrar nuevo usuario
export const registerUser = async (
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  return response;
};
// Función para reenviar enlace de verificación de email
export const resendEmailVerification = async (email: string) => {
  const response = await fetch(`${API_URL}/api/email/resend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  return response;
};
// Función para verificar email con link (parámetros de URL)
export const verifyEmailWithLink = async (
  id: string,
  hash: string,
  expires: string,
  signature: string
) => {
  const url = `${API_URL}/email/verify/${id}/${hash}?expires=${expires}&signature=${signature}`;

  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });

  return response;
};
