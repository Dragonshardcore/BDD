import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
// Componente para mostrar los detalles del autor
import AutorDetalleCard from "../../components/cards/AutorDetalleCard";
// Servicios para obtener y eliminar autores
import { obtenerAutoresPorId, eliminarAutor } from "../../Services/autores_service";

const AutorDetalle = () => {
  // Obtener el ID del autor desde los parámetros de la URL
  const { id } = useParams();
  const navigate = useNavigate(); // Para navegación entre páginas

  // Estados para manejar los datos del autor, carga y errores
  const [autor, setAutor] = useState(null); // Almacena los datos del autor
  const [loading, setLoading] = useState(true); // Controla el estado de carga
  const [error, setError] = useState(null); // Almacena mensajes de error

  // Verificar si el usuario está autenticado
  const isLogged = !!localStorage.getItem("username");

  // Efecto para cargar los datos del autor cuando cambia el ID
  useEffect(() => {
    const cargarAutor = async () => {
      try {
        const data = await obtenerAutoresPorId(id); // Obtener datos del autor
        setAutor(data); // Guardar en estado
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la información del autor"); // Establecer mensaje de error
      } finally {
        setLoading(false); // Finalizar carga independientemente del resultado
      }
    };

    cargarAutor();
  }, [id]); // Se ejecuta cuando cambia el ID

  // Función para eliminar el autor
  const handleDelete = async () => {
    // Pedir confirmación antes de eliminar
    const confirmacion = window.confirm(
      "¿Estás seguro de eliminar este autor?\nEsta acción no se puede deshacer."
    );
    if (!confirmacion) return; // Cancelar si no se confirma

    try {
      await eliminarAutor(id); // Llamar al servicio de eliminación
      navigate("/autores"); // Redirigir a la lista de autores
    } catch (err) {
      console.error(err);
      alert("Error al eliminar el autor"); // Mostrar error
    }
  };

  // Función para navegar a la página de edición
  const handleEdit = () => {
    navigate(`/autores/editar/${id}`);
  };

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

  return (
    <Box sx={{ px: 4, py: 4 }}>
      {/* Componente que muestra los detalles del autor */}
      <AutorDetalleCard
        autor={autor} // Pasar los datos del autor
        isLogged={isLogged} // Pasar estado de autenticación
        onEdit={handleEdit} // Pasar función para editar
        onDelete={handleDelete} // Pasar función para eliminar
      />
    </Box>
  );
};

export default AutorDetalle;