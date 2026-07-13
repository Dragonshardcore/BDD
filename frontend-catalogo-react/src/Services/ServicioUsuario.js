import axios from "axios";

// Variables de entorno para la configuración de la API
const API_BASE_URL = import.meta.env.VITE_API_AUTH_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

// Función para iniciar sesión
export async function login(username, password) {
  // Preparar los parámetros para la solicitud OAuth2
  const params = new URLSearchParams();
  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  // Hacer la petición POST al endpoint de token
  const response = await axios.post(
    `${API_BASE_URL}/token/`,
    params,
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  // Guardar el token y el nombre de usuario en localStorage
  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("username", username);
  
  // Devolver la respuesta completa
  return response;
}

// Función para cerrar sesión
export async function logout() {
  // Obtener el token actual
  const token = localStorage.getItem("access_token");
  if (!token) return; // Si no hay token, no hacer nada

  // Preparar parámetros para revocar el token
  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("token", token);

  try {
    // Intentar revocar el token en el servidor
    await axios.post(
      `${API_BASE_URL}/revoke_token/`,
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
  } finally {
    // Siempre eliminar los datos locales y redirigir
    localStorage.removeItem("access_token");
    localStorage.removeItem("username");
    window.location.href = "/login"; // Redirigir a la página de login
  }
}