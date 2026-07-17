from pymongo import MongoClient
from bson import ObjectId

# ============================================================
# CONEXIÓN A MONGODB
# ============================================================

client = MongoClient("mongodb://localhost:27017/")

db = client["biblioteca_distribuida"]

# ============================================================
# COLECCIONES
# ============================================================

autores_collection = db["autores"]
libros_collection = db["libros"]
reservas_collection = db["reservas"]
logs_collection = db["logs_sincronizacion"]

# ============================================================
# ÍNDICES
# ============================================================

autores_collection.create_index(
    "id_sql",
    unique=True,
    sparse=True
)

libros_collection.create_index(
    "id_sql",
    unique=True,
    sparse=True
)

reservas_collection.create_index(
    "id_sql",
    unique=True,
    sparse=True
)

# ============================================================
# CRUD LIBROS
# ============================================================

def crear_libro(documento):
    """
    Inserta un libro en MongoDB.
    """
    resultado = libros_collection.insert_one(documento)
    return str(resultado.inserted_id)


def obtener_libros():
    """
    Obtiene todos los libros.
    """
    libros = []

    for libro in libros_collection.find():
        libro["_id"] = str(libro["_id"])
        libros.append(libro)

    return libros


def obtener_libro_por_id(id):
    """
    Obtiene un libro por su ObjectId.
    """
    libro = libros_collection.find_one(
        {"_id": ObjectId(id)}
    )

    if libro:
        libro["_id"] = str(libro["_id"])

    return libro


def actualizar_libro(id, datos):
    """
    Actualiza un libro.
    """
    resultado = libros_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": datos}
    )

    return resultado.modified_count


def eliminar_libro(id):
    """
    Elimina un libro.
    """
    resultado = libros_collection.delete_one(
        {"_id": ObjectId(id)}
    )

    return resultado.deleted_count