import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

// Componentes de layout
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Página de login
import Login from "../pages/Login/Login";

// Páginas de sincronización
import Sincronizacion from "../pages/Sincronizacion/Sincronizacion";
import LogsSincronizacion from "../pages/Sincronizacion/LogsSincronizacion";

// Páginas de autores
import ListaAutores from "../pages/Autores/ListaAutores";
import ObrasAutor from "../pages/Autores/ObrasAutor";
import AutorDetalle from "../pages/Autores/AutorDetalle";
import AutorEditar from "../pages/Autores/AutorEditar";
import AutorCrear from "../pages/Autores/AutorCrear";

// Páginas de libros
import ListaLibros from "../pages/Libros/ListaLibros";
import FormLibro from "../pages/Libros/FormLibro";
import VerLibro from "../pages/Libros/VerLibro";

// Páginas de reservas
import ListaReservas from "../pages/Reservas/ListaReservas";
import CrearReserva from "../pages/Reservas/ReservaCrear";
import ReservaEditar from "../pages/Reservas/ReservaEditar";

export default function AppRoutes() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />

      <Box
        component="main"
        sx={{
          flex: 1,
          mt: 4,
        }}
      >
        <Routes>
          {/* Acceso público */}
          <Route path="/login" element={<Login />} />

          {/* Sincronización */}
          <Route
            path="/sincronizacion"
            element={<Sincronizacion />}
          />
          <Route
            path="/sincronizacion/logs"
            element={<LogsSincronizacion />}
          />

          {/* Autores */}
          <Route path="/autores" element={<ListaAutores />} />
          <Route path="/autores/crear" element={<AutorCrear />} />
          <Route path="/autores/editar/:id" element={<AutorEditar />} />
          <Route path="/autores/:id/obras" element={<ObrasAutor />} />
          <Route path="/autores/:id" element={<AutorDetalle />} />

          {/* Libros */}
          <Route path="/" element={<ListaLibros />} />
          <Route path="/libros/nuevo" element={<FormLibro />} />
          <Route path="/libros/editar/:id" element={<FormLibro />} />
          <Route path="/libros/:id" element={<VerLibro />} />

          {/* Reservas */}
          <Route path="/reservas" element={<ListaReservas />} />
          <Route path="/reservas/crear" element={<CrearReserva />} />
          <Route
            path="/reservas/editar/:id"
            element={<ReservaEditar />}
          />
        </Routes>
      </Box>

      <Footer />
    </Box>
  );
}