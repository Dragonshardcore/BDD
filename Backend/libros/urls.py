from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    # PostgreSQL
    AutorViewSet,
    LibroViewSet,
    ReservaViewSet,

    # MongoDB
    AutorMongoViewSet,
    LibroMongoViewSet,
    ReservaMongoViewSet,

    # Sincronización
    sincronizar_mongo,
    sincronizar_postgres,

    # Logs
    listar_logs_sincronizacion,
)


router = DefaultRouter()


# ============================================================
# POSTGRESQL
# ============================================================

router.register(
    r"autores",
    AutorViewSet,
    basename="autores-postgres",
)

router.register(
    r"libros",
    LibroViewSet,
    basename="libros-postgres",
)

router.register(
    r"reservas",
    ReservaViewSet,
    basename="reservas-postgres",
)


# ============================================================
# MONGODB
# ============================================================

router.register(
    r"mongo/autores",
    AutorMongoViewSet,
    basename="autores-mongo",
)

router.register(
    r"mongo/libros",
    LibroMongoViewSet,
    basename="libros-mongo",
)

router.register(
    r"mongo/reservas",
    ReservaMongoViewSet,
    basename="reservas-mongo",
)


urlpatterns = [
    path(
        "",
        include(router.urls),
    ),

    path(
        "sync/postgres-mongo/",
        sincronizar_mongo,
        name="sync-postgres-mongo",
    ),

    path(
        "sync/mongo-postgres/",
        sincronizar_postgres,
        name="sync-mongo-postgres",
    ),

    path(
        "sync/logs/",
        listar_logs_sincronizacion,
        name="listar-logs-sincronizacion",
    ),
]
