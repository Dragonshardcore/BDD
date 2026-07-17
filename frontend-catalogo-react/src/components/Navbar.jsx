import { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Add,
  ArrowBack,
  Autorenew,
  Book,
  Groups,
  History,
  Home,
  LibraryAdd,
  Login as LoginIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  PersonAdd,
  SyncAlt,
  EventNote,
} from "@mui/icons-material";

import { Link, useLocation, useNavigate } from "react-router-dom";

import Spinner from "./Spinner";
import { logout } from "../Services/ServicioUsuario";

const logoLibreria =
  "https://www.terramall.co.cr/wp-content/uploads/2024/10/Libreria-Accesorios.png";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogged, setIsLogged] = useState(false);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const usuario = localStorage.getItem("username");

    setIsLogged(Boolean(token));
    setUsername(usuario || "");
  }, [location.pathname]);

  const handleNavigate = async (path) => {
    setMenuMovilAbierto(false);

    if (location.pathname === path) {
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 150));
      navigate(path);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const confirmar = window.confirm(
      "¿Estás seguro de que deseas cerrar sesión?"
    );

    if (!confirmar) {
      return;
    }

    try {
      setLoading(true);
      await logout();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);

      localStorage.removeItem("access_token");
      localStorage.removeItem("username");

      setIsLogged(false);
      setUsername("");

      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  const rutaActiva = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }

    return location.pathname.startsWith(path);
  };

  const navButtonSx = (path) => ({
    color: rutaActiva(path) ? "#90caf9" : "white",
    bgcolor: rutaActiva(path)
      ? "rgba(144, 202, 249, 0.14)"
      : "transparent",
    fontSize: "0.88rem",
    textTransform: "none",
    whiteSpace: "nowrap",
    borderRadius: 2,
    px: 1.5,

    "&:hover": {
      bgcolor: "rgba(255,255,255,0.10)",
    },
  });

  const enlacesPrincipales = (
    <>
      <Button
        sx={navButtonSx("/")}
        startIcon={<Home />}
        onClick={() => handleNavigate("/")}
      >
        Inicio
      </Button>

      <Button
        sx={navButtonSx("/autores")}
        startIcon={<Groups />}
        onClick={() => handleNavigate("/autores")}
      >
        Autores
      </Button>

      {isLogged && (
        <Button
          sx={navButtonSx("/reservas")}
          startIcon={<EventNote />}
          onClick={() => handleNavigate("/reservas")}
        >
          Reservas
        </Button>
      )}

      {isLogged && (
        <Button
          sx={navButtonSx("/sincronizacion")}
          startIcon={<SyncAlt />}
          onClick={() => handleNavigate("/sincronizacion")}
        >
          Sincronización
        </Button>
      )}

      {isLogged && (
        <Button
          sx={navButtonSx("/sincronizacion/logs")}
          startIcon={<History />}
          onClick={() => handleNavigate("/sincronizacion/logs")}
        >
          Logs
        </Button>
      )}
    </>
  );

  const enlacesCreacion = (
    <>
      {isLogged && (
        <>
          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              bgcolor: "rgba(255,255,255,0.25)",
              display: {
                xs: "none",
                lg: "block",
              },
            }}
          />

          <Button
            sx={{
              ...navButtonSx("/libros/nuevo"),
              color: "#90caf9",
            }}
            startIcon={<LibraryAdd />}
            onClick={() => handleNavigate("/libros/nuevo")}
          >
            Nuevo libro
          </Button>

          <Button
            sx={{
              ...navButtonSx("/autores/crear"),
              color: "#90caf9",
            }}
            startIcon={<PersonAdd />}
            onClick={() => handleNavigate("/autores/crear")}
          >
            Nuevo autor
          </Button>

          <Button
            sx={{
              ...navButtonSx("/reservas/crear"),
              color: "#90caf9",
            }}
            startIcon={<Add />}
            onClick={() => handleNavigate("/reservas/crear")}
          >
            Nueva reserva
          </Button>
        </>
      )}
    </>
  );

  return (
    <>
      <Box
        component="header"
        sx={{
          bgcolor: "#212121",
          position: "relative",
          boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
        }}
      >
        <Container maxWidth="xl">
          <Box
            sx={{
              minHeight: {
                xs: 130,
                sm: 180,
                md: 210,
              },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 2,
            }}
          >
            <Box
              component="img"
              src={logoLibreria}
              alt="Logo de la librería"
              sx={{
                width: {
                  xs: 250,
                  sm: 340,
                  md: 420,
                },
                maxHeight: {
                  xs: 100,
                  sm: 135,
                  md: 155,
                },
                objectFit: "contain",
                filter: "drop-shadow(0 5px 12px rgba(0,0,0,0.6))",
              }}
            />
          </Box>
        </Container>
      </Box>

      <AppBar
        position="sticky"
        elevation={6}
        sx={{
          bgcolor: "#353535",
          zIndex: 1100,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: {
                xs: 58,
                md: 64,
              },
              gap: 1,
            }}
          >
            <Tooltip title="Volver a la página anterior">
              <IconButton
                color="inherit"
                onClick={() => navigate(-1)}
                aria-label="Volver"
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },
                alignItems: "center",
                gap: 0.5,
                flex: 1,
                overflowX: "auto",
              }}
            >
              {enlacesPrincipales}
              {enlacesCreacion}
            </Box>

            <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

            {isLogged && username && (
              <Typography
                variant="body2"
                sx={{
                  color: "#e0e0e0",
                  mr: 1.5,
                  display: {
                    xs: "none",
                    lg: "block",
                  },
                }}
              >
                Usuario: <strong>{username}</strong>
              </Typography>
            )}

            {isLogged ? (
              <Button
                variant="contained"
                size="small"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  bgcolor: "#d32f2f",
                  textTransform: "none",
                  whiteSpace: "nowrap",

                  "&:hover": {
                    bgcolor: "#b71c1c",
                  },

                  display: {
                    xs: "none",
                    md: "inline-flex",
                  },
                }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Button
                variant="contained"
                size="small"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  bgcolor: "#2e7d32",
                  textTransform: "none",
                  whiteSpace: "nowrap",

                  "&:hover": {
                    bgcolor: "#1b5e20",
                  },

                  display: {
                    xs: "none",
                    md: "inline-flex",
                  },
                }}
              >
                Iniciar sesión
              </Button>
            )}

            <IconButton
              color="inherit"
              aria-label="Abrir menú"
              onClick={() => setMenuMovilAbierto(true)}
              sx={{
                display: {
                  xs: "inline-flex",
                  md: "none",
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={menuMovilAbierto}
        onClose={() => setMenuMovilAbierto(false)}
      >
        <Box
          sx={{
            width: 290,
            minHeight: "100%",
            bgcolor: "#292929",
            color: "white",
            p: 2,
          }}
          role="presentation"
        >
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mb: 1 }}
          >
            Menú
          </Typography>

          {isLogged && username && (
            <Typography
              variant="body2"
              color="grey.400"
              sx={{ mb: 2 }}
            >
              Sesión iniciada como {username}
            </Typography>
          )}

          <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 2 }} />

          <Stack spacing={1}>
            <Button
              fullWidth
              startIcon={<Home />}
              onClick={() => handleNavigate("/")}
              sx={navButtonSx("/")}
            >
              Inicio
            </Button>

            <Button
              fullWidth
              startIcon={<Groups />}
              onClick={() => handleNavigate("/autores")}
              sx={navButtonSx("/autores")}
            >
              Autores
            </Button>

            {isLogged && (
              <Button
                fullWidth
                startIcon={<EventNote />}
                onClick={() => handleNavigate("/reservas")}
                sx={navButtonSx("/reservas")}
              >
                Reservas
              </Button>
            )}

            {isLogged && (
              <>
                <Divider
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    my: 1,
                  }}
                />

                <Button
                  fullWidth
                  startIcon={<LibraryAdd />}
                  onClick={() => handleNavigate("/libros/nuevo")}
                  sx={navButtonSx("/libros/nuevo")}
                >
                  Crear libro
                </Button>

                <Button
                  fullWidth
                  startIcon={<PersonAdd />}
                  onClick={() => handleNavigate("/autores/crear")}
                  sx={navButtonSx("/autores/crear")}
                >
                  Crear autor
                </Button>

                <Button
                  fullWidth
                  startIcon={<Add />}
                  onClick={() => handleNavigate("/reservas/crear")}
                  sx={navButtonSx("/reservas/crear")}
                >
                  Crear reserva
                </Button>

                <Divider
                  sx={{
                    bgcolor: "rgba(255,255,255,0.2)",
                    my: 1,
                  }}
                />

                <Button
                  fullWidth
                  startIcon={<Autorenew />}
                  onClick={() => handleNavigate("/sincronizacion")}
                  sx={navButtonSx("/sincronizacion")}
                >
                  Sincronización
                </Button>

                <Button
                  fullWidth
                  startIcon={<History />}
                  onClick={() =>
                    handleNavigate("/sincronizacion/logs")
                  }
                  sx={navButtonSx("/sincronizacion/logs")}
                >
                  Historial de logs
                </Button>
              </>
            )}

            <Divider
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                my: 1,
              }}
            />

            {isLogged ? (
              <Button
                fullWidth
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{ textTransform: "none" }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Button
                fullWidth
                variant="contained"
                color="success"
                startIcon={<LoginIcon />}
                onClick={() => handleNavigate("/login")}
                sx={{ textTransform: "none" }}
              >
                Iniciar sesión
              </Button>
            )}
          </Stack>
        </Box>
      </Drawer>

      {loading && <Spinner fullscreen />}
    </>
  );
}