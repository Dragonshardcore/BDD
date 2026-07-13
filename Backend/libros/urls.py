from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LibroViewSet, ReservaViewSet, AutorViewSet,sincronizar_mongo, listar_libros_mongo, crear_libro_mongo, actualizar_libro_mongo,  eliminar_libro_mongo
from .views import sincronizar_mongo

# Router de DRF
router = DefaultRouter()

# Registro de rutas automáticas
router.register(r'libros', LibroViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'autores', AutorViewSet)

# URLs finales de la API
urlpatterns = [
    path('', include(router.urls)),

    path(
        'sync/postgres-mongo/',
        sincronizar_mongo,
        name='sync-postgres-mongo'
    ),

    path(
        'mongo/libros/',
        listar_libros_mongo,
        name='listar-libros-mongo'
    ),

    path(
        'mongo/libros/crear/',
        crear_libro_mongo,
        name='crear-libro-mongo'
    ),
    path(
    'mongo/libros/<str:id>/',
    actualizar_libro_mongo,
    name='actualizar-libro-mongo'
    ),
    path(
    'mongo/libros/eliminar/<str:id>/',
    eliminar_libro_mongo,
    name='eliminar-libro-mongo'
    ),
]
