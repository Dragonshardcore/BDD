from bson import ObjectId

from .mongo import db


class MongoModel:

    collection_name = None

    def __init__(self):
        if not self.collection_name:
            raise ValueError(
                "Debes definir collection_name en el modelo MongoDB."
            )

        self.collection = db[self.collection_name]

    def create(self, data):
        resultado = self.collection.insert_one(data)

        return str(resultado.inserted_id)

    def get_all(self):
        documentos = []

        for documento in self.collection.find():
            documento["_id"] = str(documento["_id"])
            documentos.append(documento)

        return documentos

    def get_by_id(self, document_id):
        documento = self.collection.find_one(
            {
                "_id": ObjectId(document_id)
            }
        )

        if documento:
            documento["_id"] = str(documento["_id"])

        return documento

    def update(self, document_id, data):
        resultado = self.collection.update_one(
            {
                "_id": ObjectId(document_id)
            },
            {
                "$set": data
            }
        )

        return {
            "encontrados": resultado.matched_count,
            "modificados": resultado.modified_count,
        }

    def delete(self, document_id):
        resultado = self.collection.delete_one(
            {
                "_id": ObjectId(document_id)
            }
        )

        return resultado.deleted_count
