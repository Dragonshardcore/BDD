from rest_framework import status
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .sync import (
    sincronizar_todo_mongo_a_postgres,
    sincronizar_todo_postgres_a_mongo,
)


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_mongo(request):
    """
    Sincroniza PostgreSQL hacia MongoDB.
    """
    try:
        resultado = sincronizar_todo_postgres_a_mongo()

        codigo = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo,
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


@api_view(["POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def sincronizar_postgres(request):
    """
    Sincroniza MongoDB hacia PostgreSQL.
    """
    try:
        resultado = sincronizar_todo_mongo_a_postgres()

        codigo = status.HTTP_200_OK

        if resultado.get("estado") == "fallido":
            codigo = status.HTTP_500_INTERNAL_SERVER_ERROR

        return Response(
            resultado,
            status=codigo,
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
