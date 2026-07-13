import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Stack,
  Paper,
  MenuItem,
} from "@mui/material";

// Servicios para obtener datos y crear reserva
import { obtenerLibros } from "../../Services/libros_service";
import { crearReserva } from "../../Services/reservas_service";

export default function ReservaCrear() {
  const navigate = useNavigate(); // Para redirigir después de crear

  // Estado para almacenar la lista de libros disponibles
  const [libros, setLibros] = useState([]);

  // Estado del formulario para nueva reserva
  const [reserva, setReserva] = useState({
    libro: "",          // ID del libro seleccionado
    usuario: "",        // Nombre del usuario
    fecha_reserva: "",  // Fecha de reserva
    fecha_devolucion: "", // Fecha de devolución
  });

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login"); // Redirigir al login si no hay usuario
    }
  }, [navigate]);

  // Cargar lista de libros disponibles
  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const res = await obtenerLibros(); // Obtener todos los libros
        setLibros(res);
      } catch (error) {
        console.error("Error al cargar libros", error);
      }
    };
    cargarLibros();
  }, []); // Solo se ejecuta al montar el componente

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar formulario para crear nueva reserva
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    try {
      await crearReserva(reserva); // Llamar al servicio para crear reserva
      alert("Reserva creada con éxito");
      navigate("/reservas"); // Redirigir a la lista de reservas
    } catch (error) {
      console.error(error);
      alert("Error al crear la reserva");
    }
  };

  return (
    <Box sx={{ pt: 10, minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: "20px" }}>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Nueva Reserva
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Selector de libro */}
              <TextField
                select
                fullWidth
                label="Libro"
                name="libro"
                value={reserva.libro}
                onChange={handleChange}
                variant="filled"
                required
              >
                {/* Mapear lista de libros para opciones */}
                {libros.map((libro) => (
                  <MenuItem key={libro.id} value={libro.id}>
                    {libro.titulo}
                  </MenuItem>
                ))}
              </TextField>

              {/* Campo para nombre de usuario */}
              <TextField
                fullWidth
                label="Usuario"
                name="usuario"
                value={reserva.usuario}
                onChange={handleChange}
                variant="filled"
                required
              />

              {/* Campo para fecha de reserva */}
              <TextField
                fullWidth
                label="Fecha de reserva"
                name="fecha_reserva"
                type="date"
                value={reserva.fecha_reserva}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }} // Para que la etiqueta no se superponga
                variant="filled"
                required
              />

              {/* Campo para fecha de devolución */}
              <TextField
                fullWidth
                label="Fecha de devolución"
                name="fecha_devolucion"
                type="date"
                value={reserva.fecha_devolucion}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="filled"
                required
              />

              {/* Botón para guardar la reserva */}
              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
              >
                Guardar Reserva
              </Button>

              {/* Botón para cancelar y volver atrás */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(-1)} // Regresa a la página anterior
              >
                Cancelar
              </Button>
            </Stack>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}