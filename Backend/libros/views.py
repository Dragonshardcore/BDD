from rest_framework import status, viewsets
from .mongo import logs_collection
from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Autor, Libro, Reserva
from .serializers import (
    AutorSerializer,
    LibroSerializer,
    ReservaSerializer,
)
from .mongo import (
    crear_libro,
    obtener_libros,
    actualizar_libro,
    eliminar_libro,
)
from .sync import (
    sincronizar_todo_postgres_a_mongo,
    sincronizar_todo_mongo_a_postgres,
)



# ============================================================
# VIEWSETS POSTGRESQL
# ============================================================

class AutorViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de autores en PostgreSQL.
    """
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer


class LibroViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de libros en PostgreSQL.
    """
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    """
    CRUD completo de reservas en PostgreSQL.
    """
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer


# ============================================================
# CRUD MONGODB: LIBROS
# ============================================================

@api_view(["GET"])
def listar_libros_mongo(request):
    """
    Lista todos los libros almacenados en MongoDB.
    """
    libros = obtener_libros()

    return Response(
        libros,
        status=status.HTTP_200_OK
    )


@api_view(["POST"])
def crear_libro_mongo(request):
    """
    Crea un libro directamente en MongoDB.
    """
    try:
        documento = dict(request.data)

        id_generado = crear_libro(documento)

        return Response(
            {
                "mensaje": "Libro creado correctamente en MongoDB",
                "id": id_generado
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as error:
        return Response(
            {
                "mensaje": "No fue posible crear el libro",
                "error": str(error)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["PUT", "PATCH"])
def actualizar_libro_mongo(request, id):
    """
    Actualiza un libro directamente en MongoDB.
    """
    try:
        datos = dict(request.data)

        cantidad_modificada = actualizar_libro(
            id,
            datos
        )

        if cantidad_modificada == 0:
            return Response(
                {
                    "mensaje": (
                        "No se encontró el libro o los datos "
                        "enviados son iguales a los existentes"
                    )
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "mensaje": "Libro actualizado correctamente en MongoDB",
                "registros_modificados": cantidad_modificada
            },
            status=status.HTTP_200_OK
        )

    except Exception as error:
        return Response(
            {
                "mensaje": "No fue posible actualizar el libro",
                "error": str(error)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(["DELETE"])
def eliminar_libro_mongo(request, id):
    """
    Elimina un libro directamente en MongoDB.
    """
    try:
        cantidad_eliminada = eliminar_libro(id)

        if cantidad_eliminada == 0:
            return Response(
                {
                    "mensaje": "Libro no encontrado en MongoDB"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {
                "mensaje": "Libro eliminado correctamente de MongoDB",
                "registros_eliminados": cantidad_eliminada
            },
            status=status.HTTP_200_OK
        )

    except Exception as error:
        return Response(
            {
                "mensaje": "No fue posible eliminar el libro",
                "error": str(error)
            },
            status=status.HTTP_400_BAD_REQUEST
        )


# ============================================================
# SINCRONIZACIÓN
# ============================================================

@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_postgres_mongo(request):
    """
    Sincroniza PostgreSQL hacia MongoDB sin requerir autenticación.
    """
    try:
        resultado = sincronizar_todo_postgres_a_mongo()

        codigo_estado = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo_estado = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo_estado
        )

    except Exception as error:
        return Response(
            {
                "estado": "fallido",
                "direccion": "postgresql_a_mongodb",
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_mongo_postgres(request):
    """
    Sincroniza MongoDB hacia PostgreSQL sin requerir autenticación.
    """
    try:
        resultado = sincronizar_todo_mongo_a_postgres()

        codigo_estado = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo_estado = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo_estado
        )

    except Exception as error:
        return Response(
            {
                "estado": "fallido",
                "direccion": "mongodb_a_postgresql",
                "error": str(error)
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["GET"])
@authentication_classes([])
@permission_classes([AllowAny])
def listar_logs_sincronizacion(request):
    try:
        logs = []

        for log in logs_collection.find().sort("fecha", -1):
            log["_id"] = str(log["_id"])
            logs.append(log)

        return Response(
            {
                "estado": "completado",
                "cantidad": len(logs),
                "logs": logs,
            },
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