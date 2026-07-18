from rest_framework import status, viewsets
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import (
    Autor,
    Libro,
    Reserva,
)

from .serializers import (
    AutorSerializer,
    LibroSerializer,
    ReservaSerializer,
)

from .mongo_models import (
    AutorMongo,
    LibroMongo,
    ReservaMongo,
)

from .mongo_viewsets import VistaModeloMongo

from .servicios import (
    ejecutar_sincronizacion_postgres_mongo,
    ejecutar_sincronizacion_mongo_postgres,
    obtener_logs_sincronizacion,
)


# ============================================================
# VIEWSETS POSTGRESQL
# ============================================================

class AutorViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de autores almacenados en PostgreSQL.
    """

    queryset = Autor.objects.all()
    serializer_class = AutorSerializer


class LibroViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de libros almacenados en PostgreSQL.
    """

    queryset = Libro.objects.all()
    serializer_class = LibroSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de reservas almacenadas en PostgreSQL.
    """

    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer


# ============================================================
# VIEWSETS MONGODB
# ============================================================

class AutorMongoViewSet(VistaModeloMongo):
    """
    CRUD completo de autores almacenados en MongoDB.
    """

    modelo_mongo = AutorMongo


class LibroMongoViewSet(VistaModeloMongo):
    """
    CRUD completo de libros almacenados en MongoDB.
    """

    modelo_mongo = LibroMongo


class ReservaMongoViewSet(VistaModeloMongo):
    """
    CRUD completo de reservas almacenadas en MongoDB.
    """

    modelo_mongo = ReservaMongo


# ============================================================
# SINCRONIZACIÓN POSTGRESQL → MONGODB
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_mongo(request):
    """
    Sincroniza PostgreSQL hacia MongoDB.
    """

    try:
        resultado = ejecutar_sincronizacion_postgres_mongo()

        codigo_estado = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo_estado = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo_estado,
        )

    except Exception as error:
        return Response(
            {
                "estado": "fallido",
                "direccion": "postgresql_a_mongodb",
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# SINCRONIZACIÓN MONGODB → POSTGRESQL
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_postgres(request):
    """
    Sincroniza MongoDB hacia PostgreSQL.
    """

    try:
        resultado = ejecutar_sincronizacion_mongo_postgres()

        codigo_estado = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo_estado = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo_estado,
        )

    except Exception as error:
        return Response(
            {
                "estado": "fallido",
                "direccion": "mongodb_a_postgresql",
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


# ============================================================
# LOGS DE SINCRONIZACIÓN
# ============================================================

@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def listar_logs_sincronizacion(request):
    """
    Lista los logs de sincronización.
    """

    try:
        resultado = obtener_logs_sincronizacion()

        return Response(
            resultado,
            status=status.HTTP_200_OK,
        )

    except Exception as error:
        return Response(
            {
                "estado": "fallido",
                "error": str(error),
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
