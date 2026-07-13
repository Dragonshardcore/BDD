import { useState, useEffect } from "react";
import { Box, Container, Button, Divider } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../components/Spinner";

// URL de la imagen del logo de la librería
const logoLibreria =
  "https://www.terramall.co.cr/wp-content/uploads/2024/10/Libreria-Accesorios.png";

export default function Navbar() {
  // Estado para verificar si el usuario está autenticado
  const [isLogged, setIsLogged] = useState(false);
  // Estado para controlar la visualización del spinner
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Efecto para verificar el estado de autenticación al cargar el componente
  useEffect(() => {
    setIsLogged(!!localStorage.getItem("username"));
  }, []);

  // Función para navegar a una ruta con un spinner de carga
  const handleNavigate = async (path) => {
    setLoading(true);
    // Simular un pequeño retraso para que se vea el spinner
    await new Promise(res => setTimeout(res, 200));
    navigate(path);
    setLoading(false);
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 300));
    localStorage.clear(); // Limpiar datos de autenticación
    navigate("/login"); // Redirigir a login
    setIsLogged(false); // Actualizar estado
    setLoading(false);
  };

  // Estilo para los botones de navegación
  const navBtn = {
    color: "white",
    fontSize: "0.9rem",
    textTransform: "none",
    "&:hover": { bgcolor: "rgba(255,255,255,0.08)" },
  };

  return (
    <>
      {/* HEADER - Sección superior con el logo */}
      <Box
        component="header"
        sx={{
          position: "relative",
          bgcolor: "#2b2b2b",
          height: 220,
        }}
      >
        {/* LOGO - Imagen centrada en el header */}
        <Box sx={{ textAlign: "center", pt: 3 }}>
          <img
            src={logoLibreria}
            alt="Librería Logo"
            style={{
              height: "150px",
              width: "420px",
              filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.6))",
            }}
          />
        </Box>

        {/* NAVBAR SUPERPUESTO - Menú de navegación */}
        <Box
          component="nav"
          sx={{
            position: "absolute",
            bottom: -24, // Posiciona la navbar parcialmente sobre el header
            left: 0,
            width: "100%",
            zIndex: 10, // Asegura que esté por encima de otros elementos
          }}
        >
          <Container>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                bgcolor: "#3a3a3a",
                px: 3,
                py: 0.5,
                borderRadius: "14px",
                minHeight: "48px",
                width: "92%",
                mx: "auto", // Centrado horizontal
                boxShadow: "0px 6px 16px rgba(0,0,0,0.4)",
              }}
            >
              {/* SECCIÓN DE ENLACES DE NAVEGACIÓN (izquierda) */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {/* Botón para volver a la página anterior */}
                <Button variant="outlined" size="small" onClick={() => navigate(-1)}>
                  Volver
                </Button>

                {/* Botones principales de navegación */}
                <Button sx={navBtn} onClick={() => handleNavigate("/")}>
                  Inicio
                </Button>
                <Button sx={navBtn} onClick={() => handleNavigate("/autores")}>
                  Autores
                </Button>
                <Button sx={navBtn} onClick={() => handleNavigate("/reservas")}>
                  Reservas
                </Button>

                {/* Divisor vertical para separar secciones */}
                <Divider orientation="vertical" flexItem sx={{ mx: 1, bgcolor: "#555" }} />

                {/* Botones que solo se muestran si el usuario está autenticado */}
                {isLogged && (
                  <>
                    {/* Botón para crear nuevo libro */}
                    <Button
                      sx={{ ...navBtn, color: "#90caf9" }}
                      onClick={() => handleNavigate("/libros/nuevo")}
                    >
                      + Libro
                    </Button>

                    {/* Botón para crear nuevo autor */}
                    <Button
                      sx={{ ...navBtn, color: "#90caf9" }}
                      onClick={() => handleNavigate("/autores/crear")}
                    >
                      + Autor
                    </Button>

                    {/* Botón para crear nueva reserva */}
                    <Button
                      sx={{ ...navBtn, color: "#90caf9" }}
                      onClick={() => handleNavigate("/reservas/crear")}
                    >
                      + Reserva
                    </Button>
                  </>
                )}
              </Box>

              {/* SECCIÓN DE AUTENTICACIÓN (derecha) */}
              {isLogged ? (
                // Botón de cerrar sesión (si está autenticado)
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  sx={{
                    bgcolor: "#d32f2f", // Rojo
                    "&:hover": { bgcolor: "#b71c1c" },
                  }}
                >
                  Salir
                </Button>
              ) : (
                // Botón de iniciar sesión (si no está autenticado)
                <Button
                  variant="contained"
                  size="small"
                  component={Link}
                  to="/login"
                  startIcon={<LoginIcon />}
                  sx={{
                    bgcolor: "#2e7d32", // Verde
                    "&:hover": { bgcolor: "#1b5e20" },
                  }}
                >
                  Iniciar sesión
                </Button>
              )}
            </Box>
          </Container>
        </Box>
      </Box>

      {/* ESPACIADOR - Evita que el contenido se solape con la navbar */}
      <Box sx={{ height: 10 }} />

      {/* SPINNER DE CARGA - Se muestra durante las transiciones */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            inset: 0, // Ocupa toda la pantalla
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            bgcolor: "rgba(255,255,255,0.6)", // Fondo semitransparente
            zIndex: 9999, // Por encima de todo
          }}
        >
          <Spinner />
        </Box>
      )}
    </>
  );
}