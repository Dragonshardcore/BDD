from bson import ObjectId
from bson.errors import InvalidId

from rest_framework import status, viewsets
from rest_framework.response import Response


class VistaModeloMongo(viewsets.ViewSet):
    """
    ViewSet genérico para realizar CRUD sobre MongoDB.
    """

    modelo_mongo = None

    def obtener_modelo(self):
        """
        Crea una instancia del modelo Mongo configurado
        en cada ViewSet específico.
        """

        if self.modelo_mongo is None:
            raise ValueError(
                "Debes configurar la propiedad modelo_mongo."
            )

        return self.modelo_mongo()

    def list(self, request):
        """
        GET /api/mongo/recurso/
        Lista todos los documentos.
        """

        try:
            modelo = self.obtener_modelo()
            documentos = modelo.obtener_todos()

            return Response(
                documentos,
                status=status.HTTP_200_OK,
            )

        except Exception as error:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "No se pudieron obtener los documentos.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def retrieve(self, request, pk=None):
        """
        GET /api/mongo/recurso/{id}/
        Obtiene un documento por su ObjectId.
        """

        try:
            if not ObjectId.is_valid(pk):
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "El identificador de MongoDB no es válido.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            modelo = self.obtener_modelo()
            documento = modelo.obtener_por_id(pk)

            if documento is None:
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "Documento no encontrado.",
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
                    "estado": "fallido",
                    "detalle": "El identificador de MongoDB no es válido.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "No se pudo obtener el documento.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def create(self, request):
        """
        POST /api/mongo/recurso/
        Crea un documento en MongoDB.
        """

        try:
            datos = request.data.copy()

            # MongoDB crea automáticamente el campo _id.
            datos.pop("_id", None)

            modelo = self.obtener_modelo()
            identificador = modelo.crear(datos)

            documento = modelo.obtener_por_id(identificador)

            return Response(
                documento,
                status=status.HTTP_201_CREATED,
            )

        except Exception as error:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "No se pudo crear el documento.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def update(self, request, pk=None):
        """
        PUT /api/mongo/recurso/{id}/
        Actualiza completamente un documento.
        """

        return self._actualizar_documento(
            request=request,
            pk=pk,
            parcial=False,
        )

    def partial_update(self, request, pk=None):
        """
        PATCH /api/mongo/recurso/{id}/
        Actualiza parcialmente un documento.
        """

        return self._actualizar_documento(
            request=request,
            pk=pk,
            parcial=True,
        )

    def _actualizar_documento(
        self,
        request,
        pk=None,
        parcial=False,
    ):
        try:
            if not ObjectId.is_valid(pk):
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "El identificador de MongoDB no es válido.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            modelo = self.obtener_modelo()
            documento_actual = modelo.obtener_por_id(pk)

            if documento_actual is None:
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "Documento no encontrado.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            datos = request.data.copy()

            # Nunca se debe modificar el ObjectId.
            datos.pop("_id", None)

            if not parcial:
                datos_actualizados = datos
            else:
                datos_actualizados = datos

            resultado = modelo.actualizar(
                pk,
                datos_actualizados,
            )

            documento_actualizado = modelo.obtener_por_id(pk)

            return Response(
                {
                    "estado": "completado",
                    "encontrados": resultado["encontrados"],
                    "modificados": resultado["modificados"],
                    "documento": documento_actualizado,
                },
                status=status.HTTP_200_OK,
            )

        except InvalidId:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "El identificador de MongoDB no es válido.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "No se pudo actualizar el documento.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def destroy(self, request, pk=None):
        """
        DELETE /api/mongo/recurso/{id}/
        Elimina un documento.
        """

        try:
            if not ObjectId.is_valid(pk):
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "El identificador de MongoDB no es válido.",
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            modelo = self.obtener_modelo()
            eliminados = modelo.eliminar(pk)

            if eliminados == 0:
                return Response(
                    {
                        "estado": "fallido",
                        "detalle": "Documento no encontrado.",
                    },
                    status=status.HTTP_404_NOT_FOUND,
                )

            return Response(
                status=status.HTTP_204_NO_CONTENT,
            )

        except InvalidId:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "El identificador de MongoDB no es válido.",
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as error:
            return Response(
                {
                    "estado": "fallido",
                    "detalle": "No se pudo eliminar el documento.",
                    "error": str(error),
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
