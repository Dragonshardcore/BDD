from rest_framework import viewsets

from .models import Autor, Libro, Reserva
from .mongo_models import (
    AutorMongo,
    LibroMongo,
    ReservaMongo,
)
from .mongo_viewsets import MongoModelViewSet
from .serializers import (
    AutorSerializer,
    LibroSerializer,
    ReservaSerializer,
)


# ============================================================
# POSTGRESQL
# ============================================================

class AutorViewSet(viewsets.ModelViewSet):
    queryset = Autor.objects.all()
    serializer_class = AutorSerializer


class LibroViewSet(viewsets.ModelViewSet):
    queryset = Libro.objects.all()
    serializer_class = LibroSerializer


class ReservaViewSet(viewsets.ModelViewSet):
    queryset = Reserva.objects.all()
    serializer_class = ReservaSerializer


# ============================================================
# MONGODB
# ============================================================

class AutorMongoViewSet(MongoModelViewSet):
    mongo_model_class = AutorMongo


class LibroMongoViewSet(MongoModelViewSet):
    mongo_model_class = LibroMongo


class ReservaMongoViewSet(MongoModelViewSet):
    mongo_model_class = ReservaMongo
