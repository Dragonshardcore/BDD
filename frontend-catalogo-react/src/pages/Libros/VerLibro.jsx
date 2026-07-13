import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, CircularProgress, Typography } from "@mui/material";
// Servicios para obtener y eliminar libros
import { obtenerLibroPorId, eliminarLibro } from "../../Services/libros_service";
// Componente para mostrar los detalles del libro
import LibroDetalleCard from "../../components/cards/LibroDetalleCard";

const VerLibro = () => {
  // Obtener el ID del libro desde los parámetros de la URL
  const { id } = useParams();
  const navigate = useNavigate(); // Para navegación entre páginas
  
  // Estados para manejar el libro, carga y errores
  const [libro, setLibro] = useState(null); // Almacena los datos del libro
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const [error, setError] = useState(null); // Almacena mensajes de error

  // Verificar si el usuario está autenticado
  const isLogged = !!localStorage.getItem("username");

  // Efecto para cargar los datos del libro cuando cambia el ID
  useEffect(() => {
    // Validar que el ID sea un número válido
    if (!id || isNaN(id)) {
      setLoading(false);
      return;
    }

    // Función asíncrona para cargar el libro
    const cargarLibro = async () => {
      try {
        const data = await obtenerLibroPorId(id); // Obtener datos del libro
        setLibro(data); // Guardar en estado
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el libro"); // Establecer mensaje de error
      } finally {
        setLoading(false); // Finalizar carga independientemente del resultado
      }
    };

    cargarLibro();
  }, [id]); // Se ejecuta cuando cambia el ID

  // Mostrar spinner de carga mientras se obtienen los datos
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Mostrar mensaje de error si hubo un problema al cargar
  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
      </Typography>
    );
  }

  // Mostrar mensaje si el libro no existe
  if (!libro) {
    return (
      <Typography align="center" mt={4}>
        Libro no encontrado
      </Typography>
    );
  }

  // Mostrar el componente de detalle del libro
  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      {/* Componente que muestra los detalles del libro */}
      <LibroDetalleCard
        libro={libro} // Pasar los datos del libro
        isLogged={isLogged} // Pasar estado de autenticación
        // Función para navegar a la página de edición
        onEdit={() => navigate(`/libros/editar/${id}`)}
        // Función para eliminar el libro
        onDelete={async () => {
          // Confirmar antes de eliminar
          const ok = window.confirm("¿Seguro que deseas eliminar este libro?");
          if (!ok) return;

          // Eliminar el libro y redirigir a la página principal
          await eliminarLibro(id);
          navigate("/");
        }}
      />
    </Box>
  );
};

export default VerLibro;