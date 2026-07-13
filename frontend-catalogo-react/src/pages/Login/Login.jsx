import { 
    Box, Button, TextField, Typography, Container, 
    Paper, Stack, CircularProgress 
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../Services/ServicioUsuario'; // Importamos la lógica de conexión a Django
import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
    // 1. ESTADOS: Para controlar los datos del form y la animación de carga
    const [loginData, setLoginData] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // 2. MANEJADOR DINÁMICO: Actualiza el objeto loginData según el 'name' del input
    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    // 3. ENVÍO DEL FORMULARIO: Lógica principal de acceso
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true); // Activamos el spinner visual

        // Usamos un pequeño delay para asegurar que el spinner se renderice antes de la petición
        setTimeout(async () => {
            try {
                // Llamamos a la función asíncrona de nuestro servicio
                const response = await login(loginData.username, loginData.password);

                // Si Django responde con éxito (Status 200 OK)
                if (response.status === 200) {
                    // Guardamos info básica para personalizar la experiencia del usuario
                    localStorage.setItem("username", loginData.username);
                    localStorage.setItem("access_token", response.data.access_token);
                    // Redirección forzada al Home para refrescar el estado global
                    window.location.href = "/";
                }
            } catch (error) {
                // Si las credenciales fallan o el servidor no responde
                console.error("Error en login:", error);
                alert("Usuario o contraseña incorrectos");
            } finally {
                // Apagamos el spinner pase lo que pase (éxito o error)
                setLoading(false);
            }
        }, 50);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100vw',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                bgcolor: '#f5f5f5', // Fondo gris claro para resaltar el formulario
            }}
        >
            {/* Contenedor principal: Paper da el efecto de tarjeta elevada */}
            <Container maxWidth="xs">
                <Paper elevation={10} sx={{ p: 4, borderRadius: "20px", textAlign: "center" }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="primary">
                        Bienvenido
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Inicia sesión para gestionar tu Librería
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            {/* Inputs de Material UI: Estilizados y con validación 'required' */}
                            <TextField
                                fullWidth
                                label="Usuario"
                                name="username"
                                variant="outlined"
                                value={loginData.username}
                                onChange={handleChange}
                                required
                            />

                            <TextField
                                fullWidth
                                label="Contraseña"
                                name="password"
                                type="password"
                                variant="outlined"
                                value={loginData.password}
                                onChange={handleChange}
                                required
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                startIcon={<LoginIcon />}
                                sx={{ 
                                    py: 1.5, 
                                    fontWeight: "bold", 
                                    borderRadius: "10px", 
                                    bgcolor: "#2e7d32", 
                                    "&:hover": { bgcolor: "#1b5e20" } 
                                }}
                            >
                                Iniciar Sesión
                            </Button>
                        </Stack>
                    </Box>
                </Paper>
            </Container>

            {/* OVERLAY DE CARGA: Cubre la pantalla cuando 'loading' es true */}
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', justifyContent: 'center', alignItems: 'center',
                        bgcolor: 'rgba(255,255,255,0.6)', // Fondo traslúcido
                        zIndex: 10,
                    }}
                >
                    <CircularProgress size={60} />
                </Box>
            )}
        </Box>
    );
}