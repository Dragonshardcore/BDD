import { Card, CardContent, CardMedia, Typography, Button, Stack } from "@mui/material";

// Componente para mostrar los detalles completos de un libro
// Recibe como props: libro (datos), isLogged (estado de autenticación), onEdit y onDelete (funciones)
const LibroDetalleCard = ({ libro, isLogged, onEdit, onDelete }) => {
  return (
    // Tarjeta principal con diseño flex para disposición horizontal
    <Card sx={{ display: "flex", p: 2, gap: 2 }}>
      {/* Imagen de portada del libro */}
      <CardMedia
        component="img"
        image={libro.imagen_url} // URL de la imagen
        alt={libro.titulo} // Texto alternativo con el título
        sx={{ 
          width: 200, // Ancho fijo
          borderRadius: 2, // Bordes redondeados
          objectFit: "cover" // Ajusta la imagen al contenedor sin deformar
        }}
      />

      {/* Contenido textual de la tarjeta */}
      <CardContent sx={{ flex: 1 }}> {/* Ocupa el espacio restante */}
        {/* Título del libro */}
        <Typography variant="h5" fontWeight="bold">
          {libro.titulo}
        </Typography>

        {/* Nombre del autor */}
        <Typography variant="subtitle1" color="text.secondary">
          Autor: {libro.autor_nombre || libro.autor?.nombre}
        </Typography>

        {/* Descripción del libro (solo si existe) */}
        {libro.descripcion && (
          <Typography sx={{ mt: 2 }}>
            {libro.descripcion}
          </Typography>
        )}

        {/* Botones de acción (solo para usuarios autenticados) */}
        {isLogged && (
          <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
            {/* Botón para editar el libro */}
            <Button variant="contained" onClick={onEdit}>
              Editar
            </Button>
            {/* Botón para eliminar el libro */}
            <Button variant="outlined" color="error" onClick={onDelete}>
              Eliminar
            </Button>
          </Stack>
        )}
      </CardContent>
    </Card>
  );
};

export default LibroDetalleCard;