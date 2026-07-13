import api from "./api";

/**
 * Obtener todas las reservas
 */
export async function obtenerReservas() {
  const res = await api.get("/reservas/");
  return res.data;
}

/**
 * Obtener una reserva por ID
 */
export async function obtenerReservaPorId(id) {
  const res = await api.get(`/reservas/${id}/`);
  return res.data;
}

/**
 * Crear una nueva reserva
 */
export async function crearReserva(data) {
  const res = await api.post("/reservas/", data);
  return res.data;
}

/**
 * Actualizar una reserva existente
 */
export async function actualizarReserva(id, data) {
  const res = await api.put(`/reservas/${id}/`, data);
  return res.data;
}

/**
 * Eliminar una reserva
 */
export async function eliminarReserva(id) {
  await api.delete(`/reservas/${id}/`);
}
