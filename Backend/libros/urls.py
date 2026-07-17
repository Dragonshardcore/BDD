from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AutorViewSet,
    LibroViewSet,
    ReservaViewSet,
    actualizar_libro_mongo,
    crear_libro_mongo,
    eliminar_libro_mongo,
    listar_libros_mongo,
    listar_logs_sincronizacion,
    sincronizar_mongo_postgres,
    sincronizar_postgres_mongo,
)


router = DefaultRouter()

router.register(r"libros", LibroViewSet, basename="libro")
router.register(r"reservas", ReservaViewSet, basename="reserva")
router.register(r"autores", AutorViewSet, basename="autor")


urlpatterns = [
    # ==========================
    # API REST PostgreSQL (DRF)
    # ==========================
    path("", include(router.urls)),

    # ==========================
    # CRUD MongoDB
    # ==========================
    path(
        "mongo/libros/",
        listar_libros_mongo,
        name="listar-libros-mongo",
    ),
    path(
        "mongo/libros/crear/",
        crear_libro_mongo,
        name="crear-libro-mongo",
    ),
    path(
        "mongo/libros/<str:id>/",
        actualizar_libro_mongo,
        name="actualizar-libro-mongo",
    ),
    path(
        "mongo/libros/eliminar/<str:id>/",
        eliminar_libro_mongo,
        name="eliminar-libro-mongo",
    ),

    # ==========================
    # Sincronización
    # ==========================
    path(
        "sincronizar/postgres-mongo/",
        sincronizar_postgres_mongo,
        name="sincronizar-postgres-mongo",
    ),
    path(
        "sincronizar/mongo-postgres/",
        sincronizar_mongo_postgres,
        name="sincronizar-mongo-postgres",
    ),

    # ==========================
    # Logs de sincronización
    # ==========================
    path(
        "sincronizar/logs/",
        listar_logs_sincronizacion,
        name="listar-logs-sincronizacion",
    ),
]