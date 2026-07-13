import { useEffect, useState } from "react";
// Servicio para obtener la lista de autores
import { obtenerAutores } from "../../Services/autores_service";
// Componentes de Material-UI para la interfaz
import { Box, Typography, Grid } from "@mui/material";
// Componente para mostrar cada autor en una tarjeta
import AutorCard from "../../components/cards/AutorCard";

export default function ListaAutores() {
  // Estado para almacenar la lista de autores
  const [autores, setAutores] = useState([]);

  // Efecto que se ejecuta al montar el componente para cargar los autores
  useEffect(() => {
    cargarAutores();
  }, []); // El array vacío asegura que solo se ejecute una vez

  // Función asíncrona para cargar los autores desde la API
  const cargarAutores = async () => {
    try {
      const data = await obtenerAutores(); // Llamar al servicio
      setAutores(data); // Actualizar el estado con los datos obtenidos
    } catch (error) {
      console.error("Error al cargar autores", error); // Manejar errores
    }
  };

  return (
    <Box p={3}>
      {/* Título de la página */}
      <Typography variant="h4" mb={2}>
        Autores
      </Typography>

      {/* Grid responsivo para mostrar las tarjetas de autores */}
      <Grid container spacing={3}>
        {/* Mapear cada autor a un elemento del grid */}
        {autores.map((autor) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={autor.id}>
            {/* 
              Cada autor se muestra en una tarjeta
              xs=12: Ocupa todo el ancho en móviles
              sm=6: Ocupa mitad del ancho en tablets pequeñas
              md=4: Ocupa un tercio en tablets grandes
              lg=3: Ocupa un cuarto en desktop
            */}
            <AutorCard autor={autor} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}