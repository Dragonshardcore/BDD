import { Box, Container, Divider, Stack, Typography } from "@mui/material";

import StorageIcon from "@mui/icons-material/Storage";
import SyncAltIcon from "@mui/icons-material/SyncAlt";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        mt: "auto",
        bgcolor: "#1a1a1a",
        color: "white",
        py: 3,
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="body1" fontWeight="bold">
              Proyecto de Bases de Datos Distribuidas
            </Typography>

            <Typography variant="body2" color="grey.400">
              Sistema de gestión de biblioteca
            </Typography>
          </Box>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
            alignItems="center"
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <StorageIcon fontSize="small" color="primary" />

              <Typography variant="body2">
                PostgreSQL + MongoDB
              </Typography>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                bgcolor: "rgba(255,255,255,0.25)",
                display: {
                  xs: "none",
                  sm: "block",
                },
              }}
            />

            <Stack direction="row" spacing={1} alignItems="center">
              <SyncAltIcon fontSize="small" color="success" />

              <Typography variant="body2">
                Sincronización bidireccional
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Divider
          sx={{
            my: 2,
            bgcolor: "rgba(255,255,255,0.15)",
          }}
        />

        <Typography
          variant="body2"
          align="center"
          color="grey.400"
        >
          © 2026 – Proyecto Librería | Universidad SEK
        </Typography>
      </Container>
    </Box>
  );
}
