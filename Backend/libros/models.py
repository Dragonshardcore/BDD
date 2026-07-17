from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone


class Autor(models.Model):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    nacionalidad = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )
    fecha_nacimiento = models.DateField(
        blank=True,
        null=True
    )
    biografia = models.TextField(
        blank=True,
        default=""
    )
    imagen_url = models.URLField(
        max_length=500,
        blank=True,
        default=""
    )

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["apellidos", "nombres"]
        indexes = [
            models.Index(fields=["apellidos"]),
            models.Index(fields=["nacionalidad"]),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=["nombres", "apellidos"],
                name="autor_nombre_completo_unico"
            )
        ]

    def __str__(self):
        return f"{self.nombres} {self.apellidos}"


class Libro(models.Model):
    titulo = models.CharField(max_length=200)

    autor = models.ForeignKey(
        Autor,
        on_delete=models.PROTECT,
        related_name="libros"
    )

    isbn = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True
    )

    genero = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    anio_publicacion = models.PositiveIntegerField(
        blank=True,
        null=True
    )

    descripcion = models.TextField(
        blank=True,
        default=""
    )

    imagen_url = models.URLField(
        max_length=500,
        blank=True,
        default=""
    )

    cantidad_total = models.PositiveIntegerField(default=1)
    cantidad_disponible = models.PositiveIntegerField(default=1)

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["titulo"]
        indexes = [
            models.Index(fields=["titulo"]),
            models.Index(fields=["genero"]),
            models.Index(fields=["actualizado_en"]),
        ]

    def clean(self):
        if self.cantidad_disponible > self.cantidad_total:
            raise ValidationError(
                "La cantidad disponible no puede superar "
                "la cantidad total."
            )

        if (
            self.anio_publicacion
            and self.anio_publicacion > timezone.now().year
        ):
            raise ValidationError(
                "El año de publicación no puede ser futuro."
            )

    def __str__(self):
        return self.titulo


class Reserva(models.Model):
    class EstadoReserva(models.TextChoices):
        PENDIENTE = "pendiente", "Pendiente"
        ACTIVA = "activa", "Activa"
        DEVUELTA = "devuelta", "Devuelta"
        CANCELADA = "cancelada", "Cancelada"

    libro = models.ForeignKey(
        Libro,
        on_delete=models.PROTECT,
        related_name="reservas"
    )

    usuario = models.CharField(max_length=100)

    fecha_reserva = models.DateField(default=timezone.now)
    fecha_devolucion = models.DateField()

    estado = models.CharField(
        max_length=20,
        choices=EstadoReserva.choices,
        default=EstadoReserva.PENDIENTE
    )

    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-fecha_reserva"]
        indexes = [
            models.Index(fields=["usuario"]),
            models.Index(fields=["estado"]),
            models.Index(fields=["fecha_reserva"]),
        ]

    def clean(self):
        if self.fecha_devolucion < self.fecha_reserva:
            raise ValidationError(
                "La fecha de devolución no puede ser anterior "
                "a la fecha de reserva."
            )

    def __str__(self):
        return (
            f"Reserva de {self.libro.titulo} "
            f"por {self.usuario}"
        )