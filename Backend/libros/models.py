from django.db import models

from django.db import models

# MODELO AUTOR
class Autor(models.Model):
    # Nombres del autor
    nombres = models.CharField(max_length=100)
    # Apellidos del autor
    apellidos = models.CharField(max_length=100)
    # Nacionalidad 
    nacionalidad = models.CharField(max_length=50, blank=True, null=True)
    # Fecha de nacimiento 
    fecha_nacimiento = models.DateField(blank=True, null=True)
    # Breve biografía del autor
    biografia = models.TextField(blank=True, null=True)
    # URL de la imagen del autor
    imagen_url = models.URLField(max_length=500, blank=True, null=True)
    # Cómo se mostrará el autor en Django Admin
    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


# MODELO LIBRO
class Libro(models.Model):
   # Título del libro
   titulo = models.CharField(max_length=200)
   # Relación uno a muchos: un autor puede tener muchos libros
   autor = models.ForeignKey(Autor, on_delete=models.CASCADE)
   # Género del libro 
   genero = models.CharField(max_length=50, blank=True, null=True)
   # Año de publicación 
   anio_publicacion = models.PositiveIntegerField(blank=True, null=True)
   # Descripción del libro
   descripcion = models.TextField(blank=True, null=True)
   # URL de la imagen del libro
   imagen_url = models.URLField(max_length=500, blank=True, null=True)
   # Cómo se mostrará el libro
   def __str__(self):
       return self.titulo



# MODELO RESERVA
class Reserva(models.Model):
    # Relación: un libro puede tener muchas reservas
    libro = models.ForeignKey(Libro, on_delete=models.CASCADE)
    # Usuario que realiza la reserva (simplificado como texto)
    usuario = models.CharField(max_length=100)
    # Fecha en la que se reserva el libro
    fecha_reserva = models.DateField()
    # Fecha de devolución del libro
    fecha_devolucion = models.DateField()
    # Representación legible de la reserva
    def __str__(self):
        return f"Reserva de {self.libro.titulo} por {self.usuario}"
