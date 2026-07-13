import { Box, Typography } from "@mui/material";

// Componente Footer para mostrar el pie de página
export default function Footer() {
  return (
    // Contenedor principal del footer
    <Box
      component="footer" // Semánticamente indica que es un pie de página
      sx={{
        textAlign: "center", // Centra el contenido horizontalmente
        py: 2, // Padding vertical de 2 unidades (16px)
        bgcolor: "#1a1a1a", // Color de fondo oscuro
        color: "white", // Color del texto blanco
      }}
    >
      {/* Texto del copyright */}
      <Typography variant="body2">
        © 2026 – Proyecto Librería
      </Typography>
    </Box>
  );
}
