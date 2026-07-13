import api from "./api";
// Obtener todos los autores
export async function obtenerAutores() {
  const response = await api.get("/autores/");
  return response.data;
}
// Obtener un autor por ID
export async function obtenerAutoresPorId(id) {
  const response = await api.get(`/autores/${id}/`);
  return response.data;
}
// Crear autor
export async function crearAutor(data) {
  const response = await api.post("/autores/", data);
  return response.data;
}
// Editar autor
export async function actualizarAutor(id, data) {
  const response = await api.put(`/autores/${id}/`, data);
  return response.data;
}
// Eliminar autor
export async function eliminarAutor(id) {
  const response = await api.delete(`/autores/${id}/`);
  return response.data;
}
