PROYECTO FINAL FRONTEND
Sistema de Gestión de Catálogo de Libros
Equipo: Danny Caraguay - Carlos Campos  
4° Semestre - Desarrollo de Aplicaciones Web

DESCRIPCIÓN GENERAL
Este proyecto corresponde al frontend de una aplicación web full-stack para la gestión de un catálogo de libros y autores, desarrollada con React y Material-UI. El frontend funciona como una aplicación de página única (SPA) que consume una API REST desarrollada en Django, y se encarga de:

Proporcionar una interfaz gráfica intuitiva para la gestión de datos

Gestionar la autenticación del usuario mediante OAuth 2.0

Consumir los endpoints REST del backend

Implementar validaciones y manejo de errores en el cliente

Garantizar una experiencia de usuario responsive y accesible

El sistema permite a los usuarios visualizar, crear, editar y eliminar registros de autores, libros y reservas, con una interfaz que se adapta a diferentes dispositivos y tamaños de pantalla.

TECNOLOGÍAS UTILIZADAS
React 18 - Biblioteca principal para la construcción de interfaces de usuario

React Router DOM 6 - Sistema de enrutamiento para navegación entre páginas

Material-UI (MUI) 5 - Biblioteca de componentes para diseño y UI/UX

Axios - Cliente HTTP para realizar peticiones a la API

Emotion - Sistema de estilos en JavaScript para componentes

Vite - Herramienta de construcción y servidor de desarrollo

Git / GitHub - Control de versiones y repositorio de código

ESTRUCTURA DEL PROYECTO
text
frontend/
│
├── src/                    # Código fuente principal
│   ├── components/         # Componentes reutilizables
│   │   ├── cards/         # Componentes de tarjetas
│   │   │   ├── AutorCard.jsx
│   │   │   ├── AutorDetalleCard.jsx
│   │   │   ├── LibroCard.jsx
│   │   │   └── LibroDetalleCard.jsx
│   │   ├── Navbar.jsx     # Barra de navegación principal
│   │   ├── Footer.jsx     # Pie de página
│   │   └── Spinner.jsx    # Componente de carga
│   │
│   ├── pages/             # Páginas principales de la aplicación
│   │   ├── Autores/       # Páginas para gestión de autores
│   │   │   ├── ListaAutores.jsx
│   │   │   ├── AutorDetalle.jsx
│   │   │   ├── AutorEditar.jsx
│   │   │   ├── AutorCrear.jsx
│   │   │   └── ObrasAutor.jsx
│   │   ├── Libros/        # Páginas para gestión de libros
│   │   │   ├── ListaLibros.jsx
│   │   │   ├── FormLibro.jsx
│   │   │   └── VerLibro.jsx
│   │   ├── Reservas/      # Páginas para gestión de reservas
│   │   │   ├── ListaReservas.jsx
│   │   │   ├── ReservaCrear.jsx
│   │   │   └── ReservaEditar.jsx
│   │   └── Login/         # Página de autenticación
│   │       └── Login.jsx
│   │
│   ├── services/          # Servicios para comunicación con la API
│   │   ├── api.js         # Configuración base de Axios
│   │   ├── auth_service.js # Servicio de autenticación OAuth2
│   │   ├── autores_service.js # CRUD para autores
│   │   ├── libros_service.js  # CRUD para libros
│   │   └── reservas_service.js # CRUD para reservas
│   │
│   ├── App.jsx           # Componente raíz de la aplicación
│   ├── AppRoutes.jsx     # Configuración de rutas principales
│   └── main.jsx          # Punto de entrada de la aplicación
│
├── public/               # Archivos estáticos públicos
├── package.json          # Dependencias y scripts del proyecto
├── vite.config.js       # Configuración de Vite
└── .env        # Variables de entorno
COMPONENTES PRINCIPALES IMPLEMENTADOS
Componentes de Tarjetas (Cards)
El sistema implementa cuatro tipos principales de tarjetas para la presentación de datos:

AutorCard - Muestra información resumida de un autor en los listados, incluyendo nombre, nacionalidad y una vista previa de la biografía truncada a dos líneas. Incluye botones para ver detalles y para acceder a las obras del autor.

LibroCard - Presenta la información básica de un libro en un formato compacto, mostrando la portada, título y autor. Implementa un efecto visual que simula el lomo de un libro y se eleva sutilmente al pasar el cursor sobre ella.

AutorDetalleCard - Proporciona una vista completa de la información de un autor, incluyendo imagen, nombre completo, nacionalidad, fecha de nacimiento y biografía completa. Incluye botones para editar y eliminar (disponibles solo para usuarios autenticados).

LibroDetalleCard - Muestra información detallada de un libro con diseño en dos columnas: imagen de portada a la izquierda y detalles a la derecha. Incluye título, autor, género, año de publicación y descripción completa.

Componentes de Layout
Navbar - Barra de navegación principal que incluye el logo de la librería, menú de navegación condicional (muestra más opciones para usuarios autenticados) y controles de autenticación (login/logout). Implementa un spinner durante las transiciones entre páginas.

Footer - Pie de página simple que muestra información de copyright y nombre del proyecto.

Spinner - Componente reutilizable que muestra un indicador de carga circular centrado en la pantalla, utilizado durante operaciones asíncronas.

Páginas Principales
ListaAutores - Página que muestra todos los autores en un grid responsivo, utilizando el componente AutorCard para cada elemento.

ListaLibros - Página principal que presenta todos los libros en un grid uniforme, con un botón flotante para agregar nuevos libros (visible solo para usuarios autenticados).

ListaReservas - Página que muestra las reservas en formato de tabla, con columnas para libro, usuario, fechas de reserva y devolución, y acciones disponibles.

FormLibro - Formulario dual que funciona tanto para crear nuevos libros como para editar existentes, determinando el modo basándose en la presencia de un ID en los parámetros de la URL.

SISTEMA DE ENRUTAMIENTO
La aplicación implementa enrutamiento cliente utilizando React Router DOM versión 6. El archivo AppRoutes.jsx define todas las rutas disponibles en la aplicación:

/ - Página principal con listado de libros

/login - Página de autenticación

/autores - Listado de autores

/autores/:id - Detalle de autor específico

/autores/:id/obras - Libros de un autor específico

/autores/editar/:id - Edición de autor

/autores/crear - Creación de nuevo autor

/libros/nuevo - Creación de nuevo libro

/libros/editar/:id - Edición de libro existente

/libros/:id - Detalle de libro específico

/reservas - Listado de reservas

/reservas/crear - Creación de nueva reserva

/reservas/editar/:id - Edición de reserva existente

La protección de rutas se implementa a nivel de componente mediante verificación del estado de autenticación en el hook useEffect de cada página protegida.

INTEGRACIÓN CON BACKEND API
Configuración de Axios
El archivo api.js configura una instancia base de Axios con la URL del backend obtenida de las variables de entorno. Se implementa un interceptor de peticiones que automáticamente agrega el token de autenticación a las cabeceras de todas las solicitudes cuando está disponible en el localStorage.

Servicios Especializados
Cada entidad del sistema tiene su propio archivo de servicio que encapsula las operaciones CRUD correspondientes:

auth_service.js - Maneja la autenticación OAuth2, incluyendo login (obtención de token) y logout (revocación de token).

autores_service.js - Expone funciones para obtener todos los autores, obtener un autor por ID, crear autor, actualizar autor y eliminar autor.

libros_service.js - Proporciona funciones para obtener todos los libros, obtener un libro por ID, obtener libros por autor, crear libro, actualizar libro y eliminar libro.

reservas_service.js - Ofrece funciones para obtener todas las reservas, obtener una reserva por ID, crear reserva, actualizar reserva y eliminar reserva.

Patrón de Consumo de API
Cada página que requiere datos del backend sigue un patrón consistente:

Declarar estados para datos, carga y errores

Usar useEffect para cargar datos al montar el componente

Mostrar spinner mientras loading es true

Mostrar datos cuando la carga se completa exitosamente

Manejar errores y mostrar mensajes apropiados al usuario

AUTENTICACIÓN Y SEGURIDAD
El frontend implementa OAuth 2.0 con el grant type de contraseña, adecuado para aplicaciones donde el cliente es de confianza. El flujo de autenticación funciona de la siguiente manera:

El usuario ingresa sus credenciales en la página de login

El frontend envía las credenciales al endpoint /o/token/ del backend

El backend valida las credenciales y devuelve un token de acceso

El frontend almacena el token en el localStorage

En peticiones subsiguientes, el interceptor de Axios agrega automáticamente el token en la cabecera Authorization

Para logout, el frontend revoca el token en el backend y limpia el localStorage

La protección de rutas se implementa verificando la presencia del token en cada página que requiere autenticación. Si no se encuentra un token válido, el usuario es redirigido a la página de login.

Los elementos de interfaz que requieren permisos (botones de crear, editar, eliminar) se muestran condicionalmente basándose en el estado de autenticación del usuario.

DISEÑO RESPONSIVE Y UX/UI
Sistema de Grid
La aplicación utiliza el sistema de grid de Material-UI con breakpoints predefinidos:

xs (extra pequeño): 1 columna (dispositivos móviles)

sm (pequeño): 2 columnas (tablets pequeñas)

md (mediano): 3 columnas (tablets grandes)

lg (grande): 4 columnas (desktop)

Principios de Diseño
Consistencia: Todos los componentes siguen la misma paleta de colores y principios de diseño

Jerarquía visual: Uso de tipografía y espaciado para establecer importancia

Retroalimentación: Spinners durante cargas, confirmaciones para acciones destructivas

Accesibilidad: Textos alternativos, contraste adecuado, navegación por teclado

Efectos Visuales
Elevación en hover: Las tarjetas se elevan ligeramente al pasar el cursor

Transiciones suaves: Animaciones para cambios de estado

Spinner overlay: Indicador de carga que bloquea la interfaz durante operaciones

Efecto de libro: Bordes asimétricos en las tarjetas de libro que simulan un lomo

MANEJO DE ESTADO
La aplicación utiliza el sistema de estado local de React mediante hooks:

useState - Para estado local dentro de componentes (datos del formulario, estado de carga, errores)

useEffect - Para efectos secundarios como cargar datos al montar el componente, verificar autenticación, y limpiar recursos

useNavigate - Para navegación programática entre páginas

useParams - Para acceder a parámetros de la URL (como IDs de recursos)

El patrón típico para páginas que cargan datos incluye:

Estado para los datos (data)

Estado para indicar carga (loading)

Estado para errores (error)

useEffect que dispara la carga de datos

Renderizado condicional basado en los estados

VALIDACIÓN Y MANEJO DE ERRORES
Validación en Cliente
Los formularios implementan validación HTML5 básica (campos requeridos, tipos de datos) y validación adicional mediante JavaScript. Por ejemplo, el formulario de reserva valida que la fecha de devolución sea posterior a la fecha de reserva.

Manejo de Errores de API
Todas las peticiones a la API se envuelven en bloques try-catch para manejar errores de red, errores de autenticación y errores del servidor. Los errores se registran en la consola para depuración y se muestran mensajes amigables al usuario.

Confirmaciones
Para operaciones destructivas (eliminar autor, libro o reserva), se implementan confirmaciones interactivas mediante window.confirm() para prevenir acciones accidentales.

EJECUCIÓN DEL PROYECTO
Requisitos Previos
Node.js versión 16 o superior

npm o yarn instalados

Backend Django ejecutándose en el puerto 8000

Pasos de Instalación
Clonar el repositorio:

bash
git clone [url-del-repositorio]
cd frontend
Instalar dependencias:

bash
npm install
# o
yarn install
Configurar variables de entorno:
Crear un archivo .env basado en .env.example:

env
VITE_API_URL=http://localhost:8000/api
VITE_API_AUTH_URL=http://localhost:8000/o
VITE_CLIENT_ID=[client_id_proporcionado_por_oauth]
VITE_CLIENT_SECRET=[client_secret_proporcionado_por_oauth]
Iniciar servidor de desarrollo:

bash
npm run dev
# o
yarn dev
Acceder a la aplicación:
Abrir el navegador en http://localhost:5173

Scripts Disponibles
npm run dev - Inicia servidor de desarrollo con recarga en caliente

npm run build - Construye la aplicación para producción

npm run preview - Sirve la aplicación construida para previsualización

RESUMEN DE LOGROS
El frontend desarrollado demuestra competencia en las siguientes áreas:

Arquitectura de componentes - Estructura modular y reutilizable
Gestión de estado - Uso efectivo de hooks de React
Enrutamiento - Navegación compleja con protección de rutas
Consumo de APIs REST - Integración completa con backend Django
Autenticación - Implementación de OAuth 2.0 en el cliente
UI/UX - Diseño profesional con Material-UI
Responsive Design - Adaptación a múltiples dispositivos
Manejo de errores - Validación y retroalimentación al usuario
Código limpio - Documentación, estructura y buenas prácticas

CONCLUSIÓN
Este proyecto frontend representa una implementación completa y profesional de una aplicación React para la gestión de catálogo de libros. Demuestra un dominio sólido de los conceptos fundamentales de desarrollo frontend aprendidos durante el cuarto semestre, incluyendo componentes React, gestión de estado, enrutamiento, consumo de APIs y diseño de interfaces.

La aplicación se integra perfectamente con el backend Django REST, proporcionando una experiencia de usuario fluida e intuitiva. El código está bien estructurado, documentado y sigue las mejores prácticas del ecosistema React, lo que lo hace mantenible y escalable para futuras mejoras.

Este proyecto no solo cumple con los requisitos académicos establecidos, sino que también sirve como una demostración tangible de las habilidades adquiridas y como un valioso componente del portafolio profesional del estudiante.

