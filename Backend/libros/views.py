from rest_framework import viewsets
from .models import Autor, Libro, Reserva
from .serializers import AutorSerializer, LibroSerializer, ReservaSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .sync import sincronizar_postgres_a_mongo
from .mongo import crear_libro, obtener_libros
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .mongo import actualizar_libro
from .mongo import eliminar_libro

# VIEWSET AUTOR
class AutorViewSet(viewsets.ModelViewSet):
     # Obtiene todos los autores
    queryset = Autor.objects.all()
     # Usa el serializer de Autor
    serializer_class = AutorSerializer

# VIEWSET LIBRO

class LibroViewSet(viewsets.ModelViewSet):
     # Obtiene todos los libros
    queryset = Libro.objects.all()
     # Usa el serializer de Libro
    serializer_class = LibroSerializer

# VIEWSET RESERVA
class ReservaViewSet(viewsets.ModelViewSet):
     # Obtiene todas las reservas
    queryset = Reserva.objects.all()
     # Usa el serializer de Reserva
    serializer_class = ReservaSerializer


# ==========================
# CRUD MONGODB
# ==========================

@api_view(['GET'])
def listar_libros_mongo(request):

    libros = obtener_libros()

    return Response(libros)


@api_view(['POST'])
def crear_libro_mongo(request):

    documento = request.data

    id_generado = crear_libro(documento)

    return Response(
        {
            "mensaje": "Libro creado correctamente",
            "id": id_generado
        },
        status=status.HTTP_201_CREATED
    )
    
    
    
@api_view(['POST'])
def sincronizar_mongo(request):

    cantidad = sincronizar_postgres_a_mongo()

    return Response({
        "mensaje": "Sincronización completada correctamente",
        "registros_sincronizados": cantidad
    })

@api_view(['PUT'])
def actualizar_libro_mongo(request, id):

    datos = request.data

    actualizar_libro(id, datos)

    return Response({
        "mensaje": "Libro actualizado correctamente"
    })

@api_view(['DELETE'])
def eliminar_libro_mongo(request, id):

    eliminar_libro(id)

    return Response({
        "mensaje": "Libro eliminado correctamente"
    })