import api from "./api";

function obtenerMensajeError(error) {
  return (
    error.response?.data?.error ||
    error.response?.data?.detail ||
    error.response?.data?.error_general ||
    error.message ||
    "Ocurrió un error al comunicarse con el servidor."
  );
}

export async function sincronizarPostgresMongo() {
  try {
    const response = await api.post(
      "/sincronizar/postgres-mongo/"
    );

    return response.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}

export async function sincronizarMongoPostgres() {
  try {
    const response = await api.post(
      "/sincronizar/mongo-postgres/"
    );

    return response.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}

export async function obtenerLogsSincronizacion() {
  try {
    const response = await api.get("/sincronizar/logs/");
    return response.data;
  } catch (error) {
    throw new Error(obtenerMensajeError(error));
  }
}