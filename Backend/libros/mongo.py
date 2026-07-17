from pymongo import MongoClient


# ============================================================
# CONEXIÓN A MONGODB
# ============================================================

cliente_mongo = MongoClient(
    "mongodb://localhost:27017/",
    serverSelectionTimeoutMS=5000,
)

base_datos_mongo = cliente_mongo["biblioteca_distribuida"]

# Alias para conservar compatibilidad con otros archivos
db = base_datos_mongo


# ============================================================
# COLECCIONES
# ============================================================

autores_collection = base_datos_mongo["autores"]
libros_collection = base_datos_mongo["libros"]
reservas_collection = base_datos_mongo["reservas"]
logs_collection = base_datos_mongo["logs_sincronizacion"]
