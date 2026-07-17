import { useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import { obtenerLibros } from "../../Services/libros_service";
import LibroCard from "../../components/cards/LibroCard";

const ListaLibros = () => {
  const [libros, setLibros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarLibros = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await obtenerLibros();
      setLibros(data);
    } catch (errorPeticion) {
      console.error("Error:", errorPeticion);
      setError("No se pudieron cargar los libros.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarLibros();
  }, []);

  return (
    <Box sx={{ px: 3, py: 3 }}>
      <Typography variant="h4" mb={3}>
        Catálogo de libros
      </Typography>

      {loading && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            my: 4,
          }}
        >
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" align="center">
          {error}
        </Typography>
      )}

      {!loading && !error && libros.length === 0 && (
        <Typography align="center">
          No existen libros registrados.
        </Typography>
      )}

      <Grid container spacing={3}>
        {libros.map((libro) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={libro.id}>
            <LibroCard libro={libro} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ListaLibros;