import { useEffect, useState } from "react";
import { obtenerReservas, eliminarReserva } from "../../Services/reservas_service";
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

export default function ListaReservas() {
  // Función para verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return !!localStorage.getItem("username"); // Devuelve true si existe username
  };

  // Estado para almacenar la lista de reservas
  const [reservas, setReservas] = useState([]);

  // Cargar reservas cuando el componente se monta
  useEffect(() => {
    cargarReservas();
  }, []);

  // Función para obtener reservas desde la API
  const cargarReservas = async () => {
    try {
      const data = await obtenerReservas();
      setReservas(data);
    } catch (error) {
      console.error("Error al cargar reservas", error);
    }
  };

  const navigate = useNavigate(); // Para navegación entre páginas

  // Función para eliminar una reserva
  const handleEliminar = async (id) => {
    // Confirmar antes de eliminar
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar esta reserva?"
    );

    if (!confirmar) return; // Si no confirma, cancelar

    try {
      await eliminarReserva(id); // Llamar al servicio de eliminación
      cargarReservas(); // Recargar la lista después de eliminar
    } catch (error) {
      console.error("Error al eliminar reserva", error);
      alert("No se pudo eliminar la reserva");
    }
  };

  return (
    <Box p={3}>
      {/* Título de la página */}
      <Typography variant="h4" mb={2}>
        Reservas
      </Typography>

      {/* Tabla para mostrar las reservas */}
      <TableContainer component={Paper}>
        <Table>
          {/* Encabezados de la tabla */}
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Libro</TableCell>
              <TableCell>Usuario</TableCell>
              <TableCell>Fecha de reserva</TableCell>
              <TableCell>Fecha de devolución</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>

          {/* Cuerpo de la tabla */}
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow key={reserva.id}>
                <TableCell>{reserva.id}</TableCell>
                <TableCell>{reserva.libro_nombre}</TableCell>
                <TableCell>{reserva.usuario}</TableCell>
                <TableCell>{reserva.fecha_reserva}</TableCell>
                <TableCell>{reserva.fecha_devolucion}</TableCell>
                <TableCell align="center">
                  {/* Botón para editar reserva */}
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<EditIcon />}
                    onClick={() => navigate(`/reservas/editar/${reserva.id}`)}
                  >
                    Editar
                  </Button>
                  
                  {/* Botón para eliminar reserva - solo visible si autenticado */}
                  {isAuthenticated() && (
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleEliminar(reserva.id)}
                      sx={{ ml: 1 }} // Margen izquierdo para separar botones
                    >
                      Eliminar
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}