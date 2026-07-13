from .models import Libro
from .mongo import libros_collection
from .mapping import libro_sql_to_json


def sincronizar_postgres_a_mongo():

    libros = Libro.objects.select_related("autor").all()

    libros_collection.delete_many({})

    cantidad = 0

    for libro in libros:

        documento = libro_sql_to_json(libro)

        libros_collection.insert_one(documento)

        cantidad += 1

    return cantidad