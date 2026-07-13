from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")

db = client["biblioteca_distribuida"]

libros_collection = db["libros"]


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