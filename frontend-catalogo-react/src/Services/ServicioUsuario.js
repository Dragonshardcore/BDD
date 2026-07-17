import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_AUTH_URL;
const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;

export async function login(username, password) {
  const params = new URLSearchParams();

  params.append("grant_type", "password");
  params.append("username", username);
  params.append("password", password);
  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);

  const response = await axios.post(
    `${API_BASE_URL}/token/`,
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  localStorage.setItem("access_token", response.data.access_token);
  localStorage.setItem("username", username);

  return response;
}

export async function logout() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    limpiarSesion();
    return;
  }

  const params = new URLSearchParams();

  params.append("client_id", CLIENT_ID);
  params.append("client_secret", CLIENT_SECRET);
  params.append("token", token);

  try {
    await axios.post(
      `${API_BASE_URL}/revoke_token/`,
      params,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  } catch (error) {
    console.error("No se pudo revocar el token:", error);
  } finally {
    limpiarSesion();
  }
}

function limpiarSesion() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("username");
  window.location.href = "/login";
}

export function estaAutenticado() {
  return Boolean(localStorage.getItem("access_token"));
}