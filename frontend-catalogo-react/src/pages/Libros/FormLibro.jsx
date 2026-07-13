import { useEffect, useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
// Servicios para operaciones con libros
import {
    crearLibro,
    editarLibro,
    obtenerLibroPorId,
} from "../../Services/libros_service";
import { obtenerAutores } from "../../Services/autores_service";

const FormLibro = () => {
    // Obtener ID del libro desde la URL (si existe)
    const { id } = useParams();
    const navigate = useNavigate();

    // Estado del formulario con valores iniciales vacíos
    const [form, setForm] = useState({
        titulo: "",
        autor: "", // Almacena el ID del autor seleccionado
        genero: "",
        anio_publicacion: "",
        descripcion: "",
        imagen_url: "",
    });

    // Estado para almacenar la lista de autores disponibles
    const [autores, setAutores] = useState([]);
    // Estado para controlar la carga durante el envío
    const [loading, setLoading] = useState(false);
    // Determinar si es una edición (hay ID) o creación (no hay ID)
    const esEdicion = Boolean(id);

    // Cargar lista de autores al montar el componente
    useEffect(() => {
        const cargarAutores = async () => {
            try {
                const data = await obtenerAutores();
                setAutores(data);
            } catch (error) {
                console.error("Error cargando autores:", error);
            }
        };

        cargarAutores();
    }, []); // Se ejecuta solo una vez al montar

    // Cargar datos del libro si es una edición
    useEffect(() => {
        if (!esEdicion) return; // Salir si no es edición

        const cargarLibro = async () => {
            try {
                // Obtener datos del libro por ID
                const data = await obtenerLibroPorId(id);
                // Prellenar el formulario con los datos obtenidos
                setForm({
                    titulo: data.titulo || "",
                    autor: data.autor || "", // ID del autor
                    genero: data.genero || "",
                    anio_publicacion: data.anio_publicacion || "",
                    descripcion: data.descripcion || "",
                    imagen_url: data.imagen_url || "",
                });
            } catch (error) {
                console.error(error);
                alert("Libro no encontrado");
                navigate("/"); // Redirigir a la lista principal
            }
        };

        cargarLibro();
    }, [id, esEdicion, navigate]); // Se ejecuta cuando cambian estas dependencias

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir comportamiento por defecto del formulario
        setLoading(true); // Activar estado de carga

        try {
            // Llamar al servicio correspondiente según si es edición o creación
            if (esEdicion) {
                await editarLibro(id, form);
                alert("Libro actualizado");
            } else {
                await crearLibro(form);
                alert("Libro creado");
            }

            navigate("/"); // Redirigir a la página principal después de guardar
        } catch (error) {
            console.error(error);
            alert("Error al guardar libro");
        } finally {
            setLoading(false); // Desactivar estado de carga
        }
    };

    return (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
            {/* Contenedor del formulario */}
            <Paper sx={{ p: 4, width: 420, borderRadius: 3, boxShadow: 6 }}>
                {/* Título del formulario (cambia según edición/creación) */}
                <Typography variant="h6" fontWeight="bold" mb={2} align="center">
                    {esEdicion ? "Editar libro" : "Crear libro"}
                </Typography>

                {/* Formulario */}
                <form onSubmit={handleSubmit}>
                    {/* Campo: Título del libro */}
                    <TextField
                        fullWidth
                        label="Título"
                        name="titulo"
                        value={form.titulo}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                    />

                    {/* Selector de autor */}
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel id="autor-label">Autor</InputLabel>
                        <Select
                            labelId="autor-label"
                            label="Autor"
                            name="autor"
                            value={form.autor}
                            onChange={handleChange}
                            required
                        >
                            {/* Opción por defecto */}
                            <MenuItem value="">Seleccione autor</MenuItem>
                            {/* Mapear lista de autores para opciones */}
                            {autores.map((a) => (
                                <MenuItem key={a.id} value={a.id}>
                                    {a.nombres} {a.apellidos}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Campo: Género */}
                    <TextField
                        fullWidth
                        label="Género"
                        name="genero"
                        value={form.genero}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Campo: Año de publicación */}
                    <TextField
                        fullWidth
                        label="Año de publicación"
                        name="anio_publicacion"
                        type="number"
                        value={form.anio_publicacion}
                        onChange={(e) =>
                            // Convertir a número antes de guardar
                            setForm({ ...form, anio_publicacion: Number(e.target.value) })
                        }
                        sx={{ mb: 2 }}
                    />

                    {/* Campo: Descripción (área de texto múltiple) */}
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Descripción"
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        sx={{ mb: 2 }}
                    />

                    {/* Campo: URL de la imagen */}
                    <TextField
                        fullWidth
                        label="OPCIONAL URL de Imagen "
                        name="imagen_url"
                        value={form.imagen_url}
                        onChange={handleChange}
                        sx={{ mb: 3 }}
                    />

                    {/* Botón de envío (cambia texto según edición/creación) */}
                    <Button type="submit" variant="contained" fullWidth disabled={loading}>
                        {esEdicion ? "Actualizar" : "Crear"}
                    </Button>
                </form>
            </Paper>
        </Box>
    );
};

export default FormLibro;