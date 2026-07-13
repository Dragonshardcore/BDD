import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
// Servicio para obtener libros filtrados por autor
import { obtenerLibrosPorAutor } from "../../Services/libros_service";
// Componente para mostrar cada libro
import LibroCard from "../../components/cards/LibroCard";

const ObrasAutor = () => {
  // Obtener el ID del autor desde los parámetros de la URL
  const { id } = useParams();
  
  // Estados para gestionar los datos, carga y errores
  const [libros, setLibros] = useState([]); // Lista de libros del autor
  const [loading, setLoading] = useState(true); // Estado de carga
  const [error, setError] = useState(null); // Mensaje de error

  // Efecto para cargar las obras del autor cuando cambia el ID
  useEffect(() => {
    const cargarLibros = async () => {
      try {
        // Obtener libros filtrados por autor desde la API
        const data = await obtenerLibrosPorAutor(id);
        setLibros(data); // Guardar los libros en el estado
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar las obras del autor");
      } finally {
        setLoading(false); // Finalizar carga independientemente del resultado
      }
    };

    cargarLibros();
  }, [id]); // Se ejecuta cada vez que cambia el ID del autor

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (loading) return <Typography>Cargando obras...</Typography>;
  
  // Mostrar mensaje de error si hubo un problema
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ px: 4, py: 3 }}>
      {/* Título de la página */}
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Obras del autor
      </Typography>
      
      {/* Verificar si el autor tiene libros */}
      {libros.length === 0 ? (
        // Mensaje si no hay libros
        <Typography mt={3}>
          Este autor no tiene libros registrados.
        </Typography>
      ) : (
        // Contenedor para mostrar las tarjetas de libros
        <Box
          sx={{
            mt: 3,
            display: "flex",
            flexWrap: "wrap", // Permitir que las tarjetas se ajusten a múltiples líneas
            gap: 3, // Espacio entre tarjetas
          }}
        >
          {/* Mapear cada libro a un componente LibroCard */}
          {libros.map((libro) => (
            <LibroCard key={libro.id} libro={libro} />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ObrasAutor;