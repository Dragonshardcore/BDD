import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Divider,
  Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// Componente para mostrar los detalles completos de un autor
// Recibe como props: autor (datos), isLogged (estado de autenticación), onEdit y onDelete (funciones)
const AutorDetalleCard = ({ autor, isLogged, onEdit, onDelete }) => {
  return (
    // Tarjeta principal con estilos personalizados
    <Card
      sx={{
        maxWidth: 1000, // Ancho máximo para diseño responsivo
        mx: "auto", // Centrado horizontal
        borderRadius: 4, // Bordes redondeados
        boxShadow: 6, // Sombra intensa
        overflow: "hidden", // Oculta contenido que sobrepase los bordes
      }}
    >
      {/* SECCIÓN SUPERIOR: Imagen y datos básicos */}
      <Box sx={{ display: "flex" }}>
        {/* Imagen del autor */}
        <CardMedia
          component="img"
          image={autor.imagen_url} // URL de la imagen
          alt={`${autor.nombres} ${autor.apellidos}`} // Texto alternativo
          sx={{
            width: 280, // Ancho fijo para la imagen
            objectFit: "cover", // Ajusta la imagen al espacio sin deformar
            bgcolor: "#f5f5f5", // Color de fondo si no hay imagen
          }}
        />

        {/* Contenido textual al lado de la imagen */}
        <CardContent sx={{ flex: 1 }}> {/* Ocupa el espacio restante */}
          {/* Nombre completo del autor */}
          <Typography variant="h4" fontWeight="bold">
            {autor.nombres} {autor.apellidos}
          </Typography>

          {/* Chips con información adicional */}
          <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
            {/* Chip de nacionalidad (si existe) */}
            {autor.nacionalidad && (
              <Chip label={`Nacionalidad: ${autor.nacionalidad}`} />
            )}
            {/* Chip de fecha de nacimiento (si existe) */}
            {autor.fecha_nacimiento && (
              <Chip label={`Fecha de nacimiento: ${autor.fecha_nacimiento}`} />
            )}
          </Box>

          {/* BOTONES DE ACCIÓN (solo para usuarios autenticados) */}
          {isLogged && (
            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              {/* Botón para editar el autor */}
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={onEdit}
              >
                Editar
              </Button>

              {/* Botón para eliminar el autor */}
              <Button
                variant="outlined"
                color="error" // Color rojo para acciones destructivas
                startIcon={<DeleteIcon />}
                onClick={onDelete}
              >
                Eliminar
              </Button>
            </Box>
          )}
        </CardContent>
      </Box>

      {/* DIVISOR visual entre secciones */}
      <Divider />

      {/* SECCIÓN DE BIOGRAFÍA */}
      <CardContent>
        {/* Título de la sección */}
        <Typography variant="h6" gutterBottom>
          Biografía
        </Typography>

        {/* Contenido de la biografía */}
        <Typography
          sx={{
            whiteSpace: "pre-line", // Mantiene saltos de línea del texto
            lineHeight: 1.7, // Espaciado entre líneas
          }}
        >
          {/* Muestra la biografía o un mensaje por defecto si no existe */}
          {autor.biografia || "Este autor no tiene biografía registrada."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default AutorDetalleCard;