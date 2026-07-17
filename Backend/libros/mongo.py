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
# ============================
# AUTORES
# ============================

def crear_autor(documento):
    resultado = autores_collection.insert_one(documento)
    return str(resultado.inserted_id)


def obtener_autores():

    autores = []

    for autor in autores_collection.find():
        autor["_id"] = str(autor["_id"])
        autores.append(autor)

    return autores


def actualizar_autor(id, datos):

    autores_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": datos}
    )


def eliminar_autor(id):

    autores_collection.delete_one(
        {"_id": ObjectId(id)}
    )

# ============================
# RESERVAS
# ============================

def crear_reserva(documento):

    resultado = reservas_collection.insert_one(documento)

    return str(resultado.inserted_id)


def obtener_reservas():

    reservas = []

    for reserva in reservas_collection.find():
        reserva["_id"] = str(reserva["_id"])
        reservas.append(reserva)

    return reservas


def actualizar_reserva(id, datos):

    reservas_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": datos}
    )


def eliminar_reserva(id):

    reservas_collection.delete_one(
        {"_id": ObjectId(id)}
    )
