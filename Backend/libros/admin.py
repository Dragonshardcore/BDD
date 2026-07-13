from django.contrib import admin
from .models import Autor, Libro, Reserva

# Registro de modelos en el panel admin
admin.site.register(Autor)
admin.site.register(Libro)
admin.site.register(Reserva)
