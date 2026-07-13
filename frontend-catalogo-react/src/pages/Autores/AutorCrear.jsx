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
} from "@mui/material";
// Servicio para crear un nuevo autor
import { crearAutor } from "../../Services/autores_service";

export default function AutorCrear() {
  const navigate = useNavigate(); // Para redirigir después de crear

  // Estado del formulario con valores iniciales vacíos
  const [autor, setAutor] = useState({
    nombres: "",
    apellidos: "",
    nacionalidad: "",
    fecha_nacimiento: "",
    biografia: "",
    imagen_url: "",
  });

  // Verificar si el usuario está autenticado
  useEffect(() => {
    if (!localStorage.getItem("username")) {
      navigate("/login"); // Redirigir al login si no hay usuario
    }
  }, [navigate]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    setAutor({
      ...autor,
      [e.target.name]: e.target.value,
    });
  };

  // Enviar el formulario para crear el autor
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página

    try {
      // Crear el autor, convirtiendo fecha vacía a null si es necesario
      await crearAutor({
        ...autor,
        fecha_nacimiento: autor.fecha_nacimiento || null,
      });
      navigate("/autores"); // Redirigir a la lista de autores
    } catch (error) {
      console.error("Error al crear autor", error);
      alert("Error al crear el autor");
    }
  };

  return (
    <Box sx={{ pt: 10, minHeight: "100vh", bgcolor: "#f0f0f0" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: "20px" }}>
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Crear Autor
          </Typography>

          {/* Formulario de creación */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Campo: Nombres del autor */}
              <TextField
                fullWidth
                label="Nombres"
                name="nombres"
                value={autor.nombres}
                onChange={handleChange}
                variant="filled"
                required
              />

              {/* Campo: Apellidos del autor */}
              <TextField
                fullWidth
                label="Apellidos"
                name="apellidos"
                value={autor.apellidos}
                onChange={handleChange}
                variant="filled"
                required
              />

              {/* Campo: Nacionalidad (opcional) */}
              <TextField
                fullWidth
                label="Nacionalidad"
                name="nacionalidad"
                value={autor.nacionalidad}
                onChange={handleChange}
                variant="filled"
              />

              {/* Campo: Fecha de nacimiento (opcional, tipo date) */}
              <TextField
                fullWidth
                label="Fecha de nacimiento"
                name="fecha_nacimiento"
                type="date"
                value={autor.fecha_nacimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                variant="filled"
              />

              {/* Campo: Biografía (opcional, área de texto amplia) */}
              <TextField
                fullWidth
                label="Biografía"
                name="biografia"
                value={autor.biografia}
                onChange={handleChange}
                multiline
                rows={5}
                variant="filled"
              />

              {/* Sección para la imagen del autor */}
              <Stack spacing={1} sx={{ my: 2 }}>
                {/* Mostrar previsualización de la imagen si hay URL */}
                {autor.imagen_url && (
                  <Box sx={{ textAlign: "center" }}>
                    <img
                      src={autor.imagen_url}
                      alt="Preview"
                      style={{
                        width: 90,
                        height: 90,
                        borderRadius: 8,
                        border: "1px solid #ccc",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                {/* Campo para la URL de la imagen */}
                <TextField
                  fullWidth
                  size="small"
                  label="URL de imagen"
                  name="imagen_url"
                  value={autor.imagen_url}
                  onChange={handleChange}
                  placeholder="https://..."
                />
              </Stack>

              {/* Botón para guardar el nuevo autor */}
              <Button
                fullWidth
                variant="contained"
                color="success"
                type="submit"
              >
                Guardar
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