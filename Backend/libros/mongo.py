from pymongo import MongoClient
from bson import ObjectId


client = MongoClient(
    "mongodb://localhost:27017/"
)

db = client["biblioteca_distribuida"]


class MongoCRUD:

    def __init__(self, collection):
        self.collection = db[collection]


    def create(self, data):

        resultado = self.collection.insert_one(data)

        return str(resultado.inserted_id)


    def get_all(self):

        datos = []

        for item in self.collection.find():

            item["_id"] = str(item["_id"])

            datos.append(item)

        return datos


    def update(self, id, data):

        self.collection.update_one(
            {
                "_id": ObjectId(id)
            },
            {
                "$set": data
            }
        )


    def delete(self, id):

        self.collection.delete_one(
            {
                "_id": ObjectId(id)
            }
        )


# Colecciones

autores_mongo = MongoCRUD("autores")

libros_mongo = MongoCRUD("libros")

reservas_mongo = MongoCRUD("reservas")
