import api from "./api";
// Obtener todos los libros
export async function obtenerLibros() {
  const response = await api.get("/libros/");
  return response.data;
}

export async function obtenerLibrosPorAutor(autorId) {
  const response = await api.get(`/libros/?autor=${autorId}`);
  return response.data;
}

// Obtener un libro por ID
export async function obtenerLibroPorId(id) {
  const response = await api.get(`/libros/${id}/`);
  return response.data;
}
// Crear un libro
export async function crearLibro(datos) {
  const response = await api.post("/libros/", datos);
  return response.data;
}
// Editar un libro
export async function editarLibro(id, datos) {
  const response = await api.put(`/libros/${id}/`, datos);
  return response.data;
}
// Eliminar un libro
export async function eliminarLibro(id) {
  const response = await api.delete(`/libros/${id}/`);
  return response.data;
}
