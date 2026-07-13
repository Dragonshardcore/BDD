import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Container, TextField, Button, Typography, Stack, Paper } from "@mui/material";
// Servicios para obtener y actualizar datos del autor
import { obtenerAutoresPorId, actualizarAutor } from "../../Services/autores_service";

export default function AutorEditar() {
    // Obtener el ID del autor desde los parámetros de la URL
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado del formulario con los datos del autor
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

    // Cargar los datos actuales del autor
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Obtener los datos del autor desde la API
                const res = await obtenerAutoresPorId(id);
                console.log("AUTOR:", res); // Para depuración
                setAutor(res); // Actualizar el estado con los datos obtenidos
            } catch (error) {
                console.error("Error al cargar autor", error);
            }
        };
        cargarDatos();
    }, [id]); // Se ejecuta cuando cambia el ID del autor

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setAutor({
            ...autor,
            [e.target.name]: e.target.value,
        });
    };

    // Enviar el formulario para actualizar el autor
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir recarga de página
        try {
            // Llamar al servicio para actualizar el autor
            await actualizarAutor(id, autor);
            alert("¡Autor actualizado con éxito!");
            // Redirigir a la página de detalle del autor
            navigate(`/autores/${id}`);
        } catch (error) {
            console.error(error);
            alert("Error al actualizar el autor");
        }
    };

    return (
        <Box sx={{ pt: 10, minHeight: "100vh", bgcolor: "#f0f0f0" }}>
            <Container maxWidth="sm">
                <Paper sx={{ p: 4, borderRadius: "20px" }}>
                    <Typography
                        variant="h5"
                        align="center"
                        sx={{ mb: 3 }}
                    >
                        Editar Autor
                    </Typography>

                    {/* Formulario de edición */}
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
                            />

                            {/* Campo: Apellidos del autor */}
                            <TextField
                                fullWidth
                                label="Apellidos"
                                name="apellidos"
                                value={autor.apellidos}
                                onChange={handleChange}
                                variant="filled"
                            />

                            {/* Campo: Nacionalidad */}
                            <TextField
                                fullWidth
                                label="Nacionalidad"
                                name="nacionalidad"
                                value={autor.nacionalidad || ""}
                                onChange={handleChange}
                                variant="filled"
                            />

                            {/* Campo: Fecha de nacimiento (tipo date) */}
                            <TextField
                                fullWidth
                                label="Fecha de nacimiento"
                                name="fecha_nacimiento"
                                type="date"
                                value={autor.fecha_nacimiento || ""}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                variant="filled"
                            />

                            {/* Campo: Biografía (área de texto amplia) */}
                            <TextField
                                fullWidth
                                label="Biografía"
                                name="biografia"
                                value={autor.biografia || ""}
                                onChange={handleChange}
                                multiline
                                rows={5}
                                variant="filled"
                            />

                            {/* Sección para la imagen del autor */}
                            <Stack spacing={1} sx={{ my: 2 }}>
                                {/* Mostrar imagen actual si existe */}
                                {autor.imagen_url && (
                                    <Box sx={{ textAlign: "center" }}>
                                        <img
                                            src={autor.imagen_url}
                                            alt="Autor"
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

                                {/* Campo para actualizar la URL de la imagen */}
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="URL de imagen"
                                    name="imagen_url"
                                    value={autor.imagen_url || ""}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </Stack>

                            {/* Botón para guardar los cambios */}
                            <Button
                                fullWidth
                                variant="contained"
                                type="submit"
                                color="success"
                            >
                                Guardar Cambios
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