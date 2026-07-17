import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import SyncAltIcon from "@mui/icons-material/SyncAlt";
import HistoryIcon from "@mui/icons-material/History";

import {
  sincronizarMongoPostgres,
  sincronizarPostgresMongo,
} from "../../Services/sincronizacion_service";

export default function Sincronizacion() {
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");

  const ejecutarSincronizacion = async (direccion) => {
    try {
      setCargando(true);
      setError("");
      setResultado(null);

      let respuesta;

      if (direccion === "postgres-mongo") {
        respuesta = await sincronizarPostgresMongo();
      } else {
        respuesta = await sincronizarMongoPostgres();
      }

      setResultado(respuesta);
    } catch (errorPeticion) {
      console.error(errorPeticion);
      setError(errorPeticion.message);
    } finally {
      setCargando(false);
    }
  };

  const obtenerTotales = () => {
    const datos = resultado?.resultado;

    if (!datos) {
      return {
        procesados: 0,
        creados: 0,
        actualizados: 0,
        conflictos: 0,
        errores: 0,
      };
    }

    return Object.values(datos).reduce(
      (acumulado, entidad) => ({
        procesados:
          acumulado.procesados + (entidad.procesados || 0),
        creados: acumulado.creados + (entidad.creados || 0),
        actualizados:
          acumulado.actualizados + (entidad.actualizados || 0),
        conflictos:
          acumulado.conflictos + (entidad.conflictos || 0),
        errores:
          acumulado.errores +
          (Array.isArray(entidad.errores)
            ? entidad.errores.length
            : 0),
      }),
      {
        procesados: 0,
        creados: 0,
        actualizados: 0,
        conflictos: 0,
        errores: 0,
      }
    );
  };

  const totales = obtenerTotales();

  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 120px)",
        bgcolor: "#f5f7fa",
        py: 5,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={3}
          sx={{
            p: {
              xs: 2,
              md: 4,
            },
            borderRadius: 4,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            alignItems={{
              xs: "flex-start",
              md: "center",
            }}
            spacing={2}
            mb={4}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Sincronización de bases de datos
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Transfiere autores, libros y reservas entre
                PostgreSQL y MongoDB.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<HistoryIcon />}
              onClick={() => navigate("/sincronizacion/logs")}
            >
              Ver historial
            </Button>
          </Stack>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <StorageIcon
                    color="primary"
                    sx={{ fontSize: 45 }}
                  />

                  <Typography variant="h6" fontWeight="bold" mt={1}>
                    PostgreSQL → MongoDB
                  </Typography>

                  <Typography color="text.secondary" my={2}>
                    Copia y actualiza la información relacional de
                    PostgreSQL en las colecciones de MongoDB.
                  </Typography>

                  <Button
                    fullWidth
                    variant="contained"
                    disabled={cargando}
                    startIcon={<SyncAltIcon />}
                    onClick={() =>
                      ejecutarSincronizacion("postgres-mongo")
                    }
                  >
                    Sincronizar hacia MongoDB
                  </Button>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  borderRadius: 3,
                }}
              >
                <CardContent>
                  <StorageIcon
                    color="success"
                    sx={{ fontSize: 45 }}
                  />

                  <Typography variant="h6" fontWeight="bold" mt={1}>
                    MongoDB → PostgreSQL
                  </Typography>

                  <Typography color="text.secondary" my={2}>
                    Transfiere los documentos de MongoDB hacia las
                    tablas relacionales de PostgreSQL.
                  </Typography>

                  <Button
                    fullWidth
                    color="success"
                    variant="contained"
                    disabled={cargando}
                    startIcon={<SyncAltIcon />}
                    onClick={() =>
                      ejecutarSincronizacion("mongo-postgres")
                    }
                  >
                    Sincronizar hacia PostgreSQL
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {cargando && (
            <Stack
              direction="row"
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ mt: 4 }}
            >
              <CircularProgress size={28} />
              <Typography>
                Ejecutando sincronización, espera un momento...
              </Typography>
            </Stack>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 4 }}>
              {error}
            </Alert>
          )}

          {resultado && (
            <Box sx={{ mt: 4 }}>
              <Divider sx={{ mb: 3 }} />

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
                mb={3}
              >
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Resultado
                  </Typography>

                  <Typography color="text.secondary">
                    Log generado: {resultado.log_id || "Sin ID"}
                  </Typography>
                </Box>

                <Chip
                  label={resultado.estado}
                  color={
                    resultado.estado === "completado"
                      ? "success"
                      : "error"
                  }
                />
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Procesados
                      </Typography>
                      <Typography variant="h5">
                        {totales.procesados}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Creados
                      </Typography>
                      <Typography variant="h5">
                        {totales.creados}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Actualizados
                      </Typography>
                      <Typography variant="h5">
                        {totales.actualizados}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Conflictos
                      </Typography>
                      <Typography variant="h5">
                        {totales.conflictos}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={6} md={2.4}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography color="text.secondary">
                        Errores
                      </Typography>
                      <Typography variant="h5">
                        {totales.errores}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              <Paper
                variant="outlined"
                sx={{
                  mt: 3,
                  p: 2,
                  bgcolor: "#f8f9fa",
                  overflowX: "auto",
                }}
              >
                <Typography
                  component="pre"
                  sx={{
                    m: 0,
                    fontFamily: "monospace",
                    fontSize: 13,
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {JSON.stringify(resultado.resultado, null, 2)}
                </Typography>
              </Paper>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}