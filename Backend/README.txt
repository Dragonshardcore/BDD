Backend – API REST Catálogo de Libros

Descripción general
Este proyecto corresponde al backend de una aplicación web full-stack para la gestión de un catálogo de libros y autores, desarrollada con Django y Django REST Framework.
El backend funciona exclusivamente como una API REST, sin renderizar vistas HTML, y se encarga de:
1. Proveer endpoints REST para el manejo de datos
2. Gestionar la autenticación mediante OAuth 2.0
3. Proteger los endpoints según permisos de acceso
   
Tecnologías utilizadas
1. Python 
2. Django
3. Django REST Framework
4. OAuth 2.0 (django-oauth-toolkit)
5. SQLite (base de datos por defecto)
6. Git / GitHub
   
Estructura del proyecto
backend/
│
├── core/               # Configuración principal del proyecto
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
│
├── libros/             # Aplicación principal
│   ├── models.py       # Modelos Autor, Libro y Reserva
│   ├── serializers.py # Serializers de DRF
│   ├── views.py       # ViewSets
│   ├── urls.py        # Rutas de la API
│   └── admin.py       # Registro en Django Admin
│
├── db.sqlite3          # Base de datos
├── manage.py
└── requirements.txt

Modelos implementados
🔹 Autor
Representa a los autores de los libros.
Campos principales:
1. nombres
2. apellidos
3. nacionalidad
4. fecha_nacimiento
5. biografia
6. imagen_url
🔹 Libro
Representa los libros del catálogo.
Campos principales:
1. titulo
2. genero
3. anio_publicacion
4. descripcion
5. imagen_url
6. autor (ForeignKey)
🔹 Reserva
Representa las reservas realizadas sobre los libros.
Campos principales:
1. libro (ForeignKey)
2. usuario
3. fecha_reserva
4. fecha_devolucion
Relaciones entre entidades
El sistema implementa las siguientes relaciones:
1. Autor – Libro (uno a muchos)
Un autor puede tener varios libros, pero cada libro pertenece a un único autor.
2. Libro – Reserva (uno a muchos)
Un libro puede tener múltiples reservas, mientras que cada reserva corresponde a un solo libro.
NOTA. Estas relaciones se implementan mediante claves foráneas (ForeignKey), asegurando la integridad referencial de los datos.

Endpoints disponibles
La API expone endpoints REST para cada entidad, implementando CRUD completo:
  Autores
GET    /api/autores/
POST   /api/autores/
GET    /api/autores/{id}/
PUT    /api/autores/{id}/
DELETE /api/autores/{id}/

  Libros
GET    /api/libros/
POST   /api/libros/
GET    /api/libros/{id}/
PUT    /api/libros/{id}/
DELETE /api/libros/{id}/

  Reservas
GET    /api/reservas/
POST   /api/reservas/
GET    /api/reservas/{id}/
PUT    /api/reservas/{id}/
DELETE /api/reservas/{id}/
NOTA. Las respuestas se entregan en formato JSON.

Autenticación y seguridad
El sistema utiliza OAuth 2.0 para la autenticación y autorización.
El backend valida los tokens enviados por el frontend
Los endpoints protegidos requieren autenticación
Se permite acceso de solo lectura a usuarios no autenticados 

Ejecución del proyecto
1. Crear y activar entorno virtual:
python -m venv venv
venv\Scripts\activate
2. Instalar dependencias:
pip install -r requirements.txt
3. Ejecutar migraciones ya con el correcto funcionamiento por parte de los componentes(modelos,vistas.etc) :
python manage.py migrate
4. Crear superusuario:
python manage.py createsuperuser
5. Iniciar servidor:
python manage.py runserver

Administración
Los modelos Autor, Libro y Reserva están registrados en el Django Admin, permitiendo su gestión desde el panel administrativo.

Resumen 
Django usado únicamente como API REST
CRUD completo para todas las entidades
Relaciones correctamente modeladas
Autenticación mediante OAuth 2.0

Preparado para ser consumido por un frontend en React