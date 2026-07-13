import axios from "axios";

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // URL base desde variables de entorno
  headers: {
    "Content-Type": "application/json", // Siempre enviar JSON
  },
});

// Interceptor de solicitudes: se ejecuta antes de cada petición
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem("access_token");

    // Si hay token, agregarlo al header de autorización
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Devolver la configuración modificada
    return config;
  },
  (error) => Promise.reject(error) // Manejar errores del interceptor
);

// Exportar la instancia configurada
export default api;