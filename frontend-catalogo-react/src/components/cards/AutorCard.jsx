import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Componente de tarjeta para mostrar información básica de un autor
// Recibe como prop: autor (objeto con datos del autor) y onDelete (función opcional)
export default function AutorCard({ autor, onDelete }) {
  const navigate = useNavigate(); // Hook para navegación programática

  return (
    // Contenedor principal de la tarjeta
    <Card
      sx={{
        borderRadius: "14px", // Bordes redondeados
        boxShadow: "0 6px 16px rgba(0,0,0,0.15)", // Sombra suave
        transition: "0.25s", // Transición suave para efectos
        maxWidth: 260, // Ancho máximo para uniformidad
        mx: "auto", // Centrado horizontal automático
        "&:hover": {
          transform: "translateY(-4px)", // Efecto de elevación al pasar el cursor
        },
      }}
    >
      {/* Imagen del autor */}
      <CardMedia
        component="img"
        height="170" // Altura fija para uniformidad
        image={
          autor.imagen_url || // URL de la imagen del autor
          "https://via.placeholder.com/300x400?text=Autor" // Imagen por defecto si no hay
        }
        alt={`${autor.nombres} ${autor.apellidos}`} // Texto alternativo accesible
      />

      {/* Contenido textual de la tarjeta */}
      <CardContent sx={{ p: 2 }}>
        {/* Nombre completo del autor */}
        <Typography variant="subtitle1" fontWeight="bold" noWrap>
          {autor.nombres} {autor.apellidos}
        </Typography>

        {/* Nacionalidad del autor */}
        <Typography variant="body2" color="text.secondary">
          {autor.nacionalidad || "Nacionalidad no definida"}
        </Typography>

        {/* Biografía corta (limitada a 2 líneas) */}
        <Typography
          variant="body2"
          sx={{
            mt: 1, // Margen superior
            fontSize: "0.8rem", // Tamaño de fuente pequeño
            display: "-webkit-box", // Usa modelo de caja para truncar texto
            WebkitLineClamp: 2, // Limita a 2 líneas
            WebkitBoxOrient: "vertical", // Orientación vertical
            overflow: "hidden", // Oculta texto excedente
          }}
        >
          {autor.biografia || "Sin biografía"} {/* Texto o mensaje por defecto */}
        </Typography>

        {/* Divisor visual */}
        <Divider sx={{ my: 1 }} />

        {/* Contenedor de botones de acción */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap", // Permite que los botones se ajusten
            gap: 0.5, // Espacio entre botones
            justifyContent: "space-between", // Distribuye espacio entre botones
          }}
        >
          {/* Botón para ver detalles del autor */}
          <Button
            size="small"
            onClick={() => navigate(`/autores/${autor.id}`)}
          >
            Ver Detalles
          </Button>

          {/* Botón para ver las obras del autor */}
          <Button
            size="small"
            color="secondary"
            onClick={() => navigate(`/autores/${autor.id}/obras`)}
          >
            Ver Obras
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}