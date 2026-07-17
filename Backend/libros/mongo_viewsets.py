from bson.errors import InvalidId
from rest_framework import status, viewsets
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


class MongoModelViewSet(viewsets.ViewSet):

    authentication_classes = []
    permission_classes = [AllowAny]

    mongo_model_class = None

    def get_model(self):
        if not self.mongo_model_class:
            raise ValueError(
                "Debes definir mongo_model_class en el ViewSet."
            )

        return self.mongo_model_class()

    def list(self, request):
        try:
            documentos = self.get_model().get_all()

            return Response(
                documentos,
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            return Response(
                {
                    "mensaje": "No fue posible listar los documentos",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, pk=None):
        try:
            documento = self.get_model().get_by_id(pk)

            if not documento:
                return Response(
                    {
                        "mensaje": "Documento no encontrado"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                documento,
                status=status.HTTP_200_OK,
            )

        except InvalidId:
            return Response(
                {
                    "mensaje": "El ID de MongoDB no es válido"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "mensaje": "No fue posible obtener el documento",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        try:
            datos = dict(request.data)

            document_id = self.get_model().create(datos)

            return Response(
                {
                    "mensaje": (
                        "Documento creado correctamente en MongoDB"
                    ),
                    "id": document_id,
                },
                status=status.HTTP_201_CREATED,
            )

        except Exception as error:
            return Response(
                {
                    "mensaje": "No fue posible crear el documento",
                    "error": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def update(self, request, pk=None):
        return self._update(request, pk)

    def partial_update(self, request, pk=None):
        return self._update(request, pk)

    def _update(self, request, pk):
        try:
            datos = dict(request.data)

            resultado = self.get_model().update(
                pk,
                datos,
            )

            if resultado["encontrados"] == 0:
                return Response(
                    {
                        "mensaje": "Documento no encontrado"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "mensaje": (
                        "Documento actualizado correctamente en MongoDB"
                    ),
                    "registros_modificados": (
                        resultado["modificados"]
                    ),
                },
                status=status.HTTP_200_OK,
            )

        except InvalidId:
            return Response(
                {
                    "mensaje": "El ID de MongoDB no es válido"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "mensaje": "No fue posible actualizar el documento",
                    "error": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

    def destroy(self, request, pk=None):
        try:
            eliminados = self.get_model().delete(pk)

            if eliminados == 0:
                return Response(
                    {
                        "mensaje": "Documento no encontrado"
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                {
                    "mensaje": (
                        "Documento eliminado correctamente de MongoDB"
                    )
                },
                status=status.HTTP_200_OK,
            )

        except InvalidId:
            return Response(
                {
                    "mensaje": "El ID de MongoDB no es válido"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "mensaje": "No fue posible eliminar el documento",
                    "error": str(error),
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
