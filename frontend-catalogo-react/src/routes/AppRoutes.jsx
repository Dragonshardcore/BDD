import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";

// Componentes de layout
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Página de login
import Login from "../pages/Login/Login";

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
    // Contenedor principal que ocupa toda la pantalla
    <Box
      sx={{
        minHeight: "100vh", // Altura mínima de toda la ventana
        display: "flex",
        flexDirection: "column", // Elementos apilados verticalmente
      }}
    >
      {/* Barra de navegación superior fija */}
      <Navbar />

      {/* Área de contenido principal que se expande */}
      <Box sx={{ flex: 1, mt: 4 }}> {/* Ocupa espacio restante, margen superior */}
        <Routes>
          {/* Ruta de login - acceso público */}
          <Route path="/login" element={<Login />} />

          {/* Rutas CRUD para autores */}
          <Route path="/autores" element={<ListaAutores />} /> {/* Lista todos */}
          <Route path="/autores/:id/obras" element={<ObrasAutor />} /> {/* Obras de un autor */}
          <Route path="/autores/:id" element={<AutorDetalle />} /> {/* Detalle autor */}
          <Route path="/autores/editar/:id" element={<AutorEditar />} /> {/* Editar autor */}
          <Route path="/autores/crear" element={<AutorCrear />} /> {/* Crear nuevo autor */}

          {/* Rutas CRUD para libros */}
          <Route path="/" element={<ListaLibros />} /> {/* Página de inicio */}
          <Route path="/libros/nuevo" element={<FormLibro />} /> {/* Crear libro */}
          <Route path="/libros/editar/:id" element={<FormLibro />} /> {/* Editar libro (reutiliza FormLibro) */}
          <Route path="/libros/:id" element={<VerLibro />} /> {/* Ver detalles libro */}

          {/* Rutas CRUD para reservas */}
          <Route path="/reservas" element={<ListaReservas />} /> {/* Lista reservas */}
          <Route path="/reservas/crear" element={<CrearReserva />} /> {/* Crear reserva */}
          <Route path="/reservas/editar/:id" element={<ReservaEditar />} /> {/* Editar reserva */}
        </Routes>
      </Box>

      {/* Pie de página inferior fijo */}
      <Footer />
    </Box>
  );
}