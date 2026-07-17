import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import RefreshIcon from "@mui/icons-material/Refresh";

import { obtenerLogsSincronizacion } from "../../Services/sincronizacion_service";

export default function LogsSincronizacion() {
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  const cargarLogs = useCallback(async () => {
    try {
      setCargando(true);
      setError("");

      const respuesta = await obtenerLogsSincronizacion();

      setLogs(respuesta.logs || []);
    } catch (errorPeticion) {
      console.error(errorPeticion);
      setError(errorPeticion.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  const formatearFecha = (fecha) => {
    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString("es-EC", {
      dateStyle: "short",
      timeStyle: "medium",
    });
  };

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
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 2,
              mb: 3,
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Historial de sincronización
              </Typography>

              <Typography color="text.secondary" mt={1}>
                Registro de transferencias, errores y conflictos.
              </Typography>
            </Box>

            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={cargarLogs}
              disabled={cargando}
            >
              Actualizar
            </Button>
          </Box>

          {cargando && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                py: 5,
              }}
            >
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {!cargando && !error && logs.length === 0 && (
            <Alert severity="info">
              No existen registros de sincronización.
            </Alert>
          )}

          {!cargando && logs.length > 0 && (
            <TableContainer
              component={Paper}
              variant="outlined"
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Fecha</TableCell>
                    <TableCell>Origen</TableCell>
                    <TableCell>Destino</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell align="center">
                      Conflictos
                    </TableCell>
                    <TableCell align="center">
                      Errores
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {logs.map((log) => (
                    <TableRow
                      key={log._id}
                      hover
                    >
                      <TableCell>
                        {formatearFecha(log.fecha_inicio)}
                      </TableCell>

                      <TableCell>
                        {log.origen || "No definido"}
                      </TableCell>

                      <TableCell>
                        {log.destino || "No definido"}
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          label={log.estado}
                          color={
                            log.estado === "completado"
                              ? "success"
                              : "error"
                          }
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={log.total_conflictos ?? 0}
                          color={
                            (log.total_conflictos ?? 0) > 0
                              ? "warning"
                              : "default"
                          }
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          size="small"
                          variant="outlined"
                          label={log.total_errores ?? 0}
                          color={
                            (log.total_errores ?? 0) > 0
                              ? "error"
                              : "default"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Container>
    </Box>
  );
}