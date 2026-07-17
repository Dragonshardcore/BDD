import { Box, CircularProgress, Typography } from "@mui/material";

export default function Spinner({
  fullscreen = false,
  mensaje = "Cargando...",
}) {
  return (
    <Box
      sx={{
        position: fullscreen ? "fixed" : "relative",
        inset: fullscreen ? 0 : "auto",
        minHeight: fullscreen ? "100vh" : 180,
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: 2,
        bgcolor: fullscreen
          ? "rgba(255, 255, 255, 0.78)"
          : "transparent",
        backdropFilter: fullscreen ? "blur(2px)" : "none",
        zIndex: fullscreen ? 9999 : "auto",
      }}
    >
      <CircularProgress size={fullscreen ? 55 : 40} />

      {mensaje && (
        <Typography
          variant="body1"
          color="text.secondary"
          fontWeight="medium"
        >
          {mensaje}
        </Typography>
      )}
    </Box>
  );
}