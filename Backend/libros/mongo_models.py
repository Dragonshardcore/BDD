from bson import ObjectId

from .mongo import base_datos_mongo


class ModeloMongo:
    nombre_coleccion = None

    def __init__(self):
        if not self.nombre_coleccion:
            raise ValueError(
                "Debes definir nombre_coleccion."
            )

        self.coleccion = base_datos_mongo[
            self.nombre_coleccion
        ]

    def crear(self, datos):
        resultado = self.coleccion.insert_one(datos)

        return str(resultado.inserted_id)

    def obtener_todos(self):
        documentos = []

        for documento in self.coleccion.find():
            documento["_id"] = str(documento["_id"])
            documentos.append(documento)

        return documentos

    def obtener_por_id(self, identificador):
        documento = self.coleccion.find_one(
            {
                "_id": ObjectId(identificador)
            }
        )

        if documento:
            documento["_id"] = str(documento["_id"])

        return documento

    def actualizar(self, identificador, datos):
        resultado = self.coleccion.update_one(
            {
                "_id": ObjectId(identificador)
            },
            {
                "$set": datos
            },
        )

        return {
            "encontrados": resultado.matched_count,
            "modificados": resultado.modified_count,
        }

    def eliminar(self, identificador):
        resultado = self.coleccion.delete_one(
            {
                "_id": ObjectId(identificador)
            }
        )

        return resultado.deleted_count


class AutorMongo(ModeloMongo):
    nombre_coleccion = "autores"


class LibroMongo(ModeloMongo):
    nombre_coleccion = "libros"


class ReservaMongo(ModeloMongo):
    nombre_coleccion = "reservas"
