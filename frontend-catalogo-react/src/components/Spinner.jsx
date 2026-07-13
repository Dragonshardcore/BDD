import { Box, CircularProgress } from "@mui/material";

// Componente Spinner para mostrar un indicador de carga
export default function Spinner() {
  return (
    // Contenedor que centra el spinner vertical y horizontalmente
    <Box
      display="flex"
      justifyContent="center"  // Centra horizontalmente
      alignItems="center"     // Centra verticalmente
      minHeight="100vh"       // Ocupa toda la altura de la ventana
    >
      {/* Componente CircularProgress de Material-UI */}
      <CircularProgress />
    </Box>
  );
}