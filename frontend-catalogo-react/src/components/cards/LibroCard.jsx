import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Componente que muestra una tarjeta con información básica de un libro
// Recibe un objeto 'libro' como prop
const LibroCard = ({ libro }) => {
  const navigate = useNavigate(); // Hook para navegación programática

  return (
    // Contenedor principal de la tarjeta
    <Card
      sx={{
        width: 190, // Ancho fijo para uniformidad
        height: '100%', // Altura completa para alinear tarjetas en grid
        display: 'flex', // Usa flexbox para layout
        flexDirection: 'column', // Organiza elementos en columna
        borderRadius: "14px 6px 6px 14px", // Borde asimétrico que simula lomo de libro
        boxShadow: 5, // Intensidad de sombra media
        overflow: "hidden", // Oculta contenido que se sale del borde
        backgroundColor: "#fafafa", // Color de fondo claro
        transition: "transform 0.2s, box-shadow 0.2s", // Transición suave para efectos hover
        "&:hover": {
          transform: "translateY(-6px)", // Se eleva ligeramente al pasar el cursor
          boxShadow: 8, // Sombra más intensa en hover
        },
      }}
    >
      {/* Imagen de portada del libro */}
      <CardMedia
        component="img" // Define como elemento imagen
        height="260" // Altura fija para uniformidad
        image={libro.imagen_url} // URL de la imagen desde los datos del libro
        alt={libro.titulo} // Texto alternativo accesible
        sx={{ objectFit: "cover" }} // Ajusta la imagen para cubrir el espacio sin deformar
      />

      {/* Contenido textual de la tarjeta */}
      <CardContent sx={{ 
        textAlign: "center", // Centra todo el texto
        py: 1.5, // Padding vertical de 1.5 unidades
        flexGrow: 1, // Ocupa el espacio restante después de la imagen
        display: 'flex', // Flex para alinear contenido
        flexDirection: 'column' // Organiza elementos en columna
      }}>
        {/* Título del libro */}
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {libro.titulo}
        </Typography>

        {/* Nombre del autor */}
        <Typography
          variant="body2"
          color="text.secondary" // Color secundario del tema
          sx={{ fontStyle: "italic" }} // Texto en cursiva
        >
          {libro.autor_nombre}
        </Typography>

        {/* Contenedor para botones */}
        <Stack 
          direction="column" // Botones apilados verticalmente
          spacing={1} // Espacio entre botones
          sx={{ 
            mt: 1, // Margen superior de 1 unidad
          }}
        >
          {/* Botón para ver detalles del libro */}
          <Button
            size="small"
            variant="outlined"
            onClick={() => navigate(`/libros/${libro.id}`)} // Navega a la página de detalles
            fullWidth // El botón ocupa todo el ancho disponible
          >
            Ver
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LibroCard;