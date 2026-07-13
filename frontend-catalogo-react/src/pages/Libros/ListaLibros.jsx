import { useEffect, useState } from "react";
import { obtenerLibros, eliminarLibro } from "../../Services/libros_service";
import LibroCard from "../../components/cards/LibroCard";
import { Link } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Grid,   // Grid responsivo
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const ListaLibros = () => {
  // Estados para almacenar la lista de libros y controlar la carga
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(false);

  // Función para cargar los libros desde la API
  const cargarLibros = async () => {
    try {
      setLoading(true); // Activar estado de carga
      const data = await obtenerLibros(); // Llamar al servicio
      setLibros(data); // Actualizar estado con los libros obtenidos
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudieron cargar los libros");
    } finally {
      setLoading(false); // Desactivar estado de carga
    }
  };

  // Cargar los libros al montar el componente
  useEffect(() => {
    cargarLibros();
  }, []); // El array vacío asegura que solo se ejecute una vez

  return (
    <Box sx={{ px: 3 }}>
      
      {/* Mostrar spinner mientras carga */}
      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Grid responsivo para mostrar las tarjetas de libros */}
      <Grid container spacing={3}>
        {libros.map((libro) => (
          // Cada libro se muestra en un item del grid
          // Los breakpoints definen cuántas columnas ocupa en diferentes tamaños de pantalla
          <Grid item xs={12} sm={6} md={4} lg={3} key={libro.id}>
            {/* Pasar el libro y la función de eliminar al componente de tarjeta */}
            <LibroCard libro={libro} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaLibros;