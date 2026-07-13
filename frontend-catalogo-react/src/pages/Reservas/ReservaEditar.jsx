import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, TextField, Button, Typography, Stack, Paper, MenuItem, } from "@mui/material";
// Servicios para obtener datos
import { obtenerLibros } from "../../Services/libros_service";
import { obtenerReservaPorId, actualizarReserva, } from "../../Services/reservas_service";

export default function ReservaEditar() {
  // Obtener ID de la reserva desde la URL
  const { id } = useParams();
  const navigate = useNavigate(); // Para navegar entre páginas

  // Estado para la lista de libros disponibles
  const [libros, setLibros] = useState([]);
  // Estado para controlar la carga de datos
  const [cargando, setCargando] = useState(true);

  // Estado del formulario de reserva
  const [reserva, setReserva] = useState({
    libro: "",          // ID del libro
    usuario: "",        // Nombre del usuario
    fecha_reserva: "",  // Fecha de reserva
    fecha_devolucion: "", // Fecha de devolución
  });

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login"); // Redirigir al login si no está autenticado
    }
  }, [navigate]);

  // Cargar la lista de libros disponibles
  useEffect(() => {
    const cargarLibros = async () => {
      try {
        const data = await obtenerLibros();
        setLibros(data);
      } catch (error) {
        console.error("Error al cargar libros", error);
      }
    };
    cargarLibros();
  }, []);

  // Cargar los datos de la reserva existente
  useEffect(() => {
    const cargarReserva = async () => {
      try {
        // Obtener la reserva por su ID
        const data = await obtenerReservaPorId(id);

        // Establecer los datos en el estado del formulario
        setReserva({
          libro: data.libro,
          usuario: data.usuario,
          fecha_reserva: data.fecha_reserva,
          fecha_devolucion: data.fecha_devolucion,
        });

        setCargando(false); // Finalizar estado de carga
      } catch (error) {
        console.error("Error al cargar reserva", error);
      }
    };

    cargarReserva();
  }, [id]); // Se ejecuta cuando cambia el ID

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setReserva({
      ...reserva,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar el formulario para actualizar la reserva
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Actualizar la reserva en el servidor
      await actualizarReserva(id, reserva);
      alert("Reserva actualizada con éxito");
      navigate("/reservas"); // Volver a la lista de reservas
    } catch (error) {
      console.error(error);
      alert("Error al actualizar la reserva");
    }
  };

  // Mostrar mensaje de carga mientras se obtienen los datos
  if (cargando) {
    return (
      <Box sx={{ pt: 10, textAlign: "center" }}>
        <Typography>Cargando reserva...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ pt: 10, minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: "20px" }}>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Editar Reserva
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
                {/* Opciones de libros disponibles */}
                {libros.map((libro) => (
                  <MenuItem key={libro.id} value={libro.id}>
                    {libro.titulo}
                  </MenuItem>
                ))}
              </TextField>

              {/* Campo para el usuario */}
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
                InputLabelProps={{ shrink: true }} // Para que la etiqueta no tape el valor
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

              {/* Botón para guardar cambios */}
              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
              >
                Guardar Cambios
              </Button>

              {/* Botón para cancelar y volver atrás */}
              <Button
                fullWidth
                variant="outlined"
                onClick={() => navigate(-1)} // Volver a la página anterior
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