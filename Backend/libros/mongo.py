from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")

db = client["biblioteca_distribuida"]

libros_collection = db["libros"]
autores_collection = db["autores"]
reservas_collection = db["reservas"]
logs_collection = db["logs_sincronizacion"]

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

# ============================
# CREATE
# ============================

def crear_libro(documento):

    resultado = libros_collection.insert_one(documento)

    return str(resultado.inserted_id)


# ============================
# READ
# ============================

def obtener_libros():

    libros = []

    for libro in libros_collection.find():

        libro["_id"] = str(libro["_id"])

        libros.append(libro)

    return libros


# ============================
# UPDATE
# ============================

def actualizar_libro(id, datos):

    libros_collection.update_one(

        {"_id": ObjectId(id)},

        {"$set": datos}

    )


# ============================
# DELETE
# ============================

def eliminar_libro(id):

    libros_collection.delete_one(

        {"_id": ObjectId(id)}

    )