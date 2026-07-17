import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

import { login } from "../../Services/ServicioUsuario";

export default function Login() {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((datosAnteriores) => ({
      ...datosAnteriores,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      await login(loginData.username, loginData.password);

      navigate("/", {
        replace: true,
      });

      // Actualiza Navbar si depende directamente de localStorage
      window.location.reload();
    } catch (errorPeticion) {
      console.error("Error en login:", errorPeticion);

      setError(
        errorPeticion.response?.data?.error_description ||
          "Usuario o contraseña incorrectos."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={10}
          sx={{
            p: 4,
            borderRadius: "20px",
            textAlign: "center",
          }}
        >
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            color="primary"
          >
            Bienvenido
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Inicia sesión para gestionar tu biblioteca.
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Usuario"
                name="username"
                value={loginData.username}
                onChange={handleChange}
                required
                disabled={loading}
              />

              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={loginData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />

              {error && (
                <Typography color="error" variant="body2">
                  {error}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                disabled={loading}
                sx={{
                  py: 1.5,
                  fontWeight: "bold",
                  borderRadius: "10px",
                  bgcolor: "#2e7d32",
                  "&:hover": {
                    bgcolor: "#1b5e20",
                  },
                }}
              >
                {loading ? "Ingresando..." : "Iniciar sesión"}
              </Button>
            </Stack>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}