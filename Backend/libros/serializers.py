from rest_framework import serializers
from .models import Autor, Libro, Reserva

# SERIALIZER AUTOR
class AutorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Autor
        # Incluye todos los campos del modelo Autor
        fields = '__all__'

# SERIALIZER LIBRO
class LibroSerializer(serializers.ModelSerializer):
    # Muestra el nombre completo del autor
    autor_nombre = serializers.CharField(
        source="autor.__str__", read_only=True
    )
    
    class Meta:
        model = Libro
        # Incluye todos los campos del libro
        fields = '__all__'


# SERIALIZER RESERVA
class ReservaSerializer(serializers.ModelSerializer):

    # Campo extra para mostrar el nombre del libro
    libro_nombre = serializers.CharField(
        source="libro.__str__", read_only=True
    )

    class Meta:
        model = Reserva
          # Incluye todos los campos de la reserva
        fields = "__all__"
