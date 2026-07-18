from .mongo import logs_collection
from .sync import (
    sincronizar_todo_postgres_a_mongo,
    sincronizar_todo_mongo_a_postgres,
)


def ejecutar_sincronizacion_postgres_mongo():
    """
    Ejecuta la sincronización PostgreSQL → MongoDB.
    """

    return sincronizar_todo_postgres_a_mongo()


def ejecutar_sincronizacion_mongo_postgres():
    """
    Ejecuta la sincronización MongoDB → PostgreSQL.
    """

    return sincronizar_todo_mongo_a_postgres()


def obtener_logs_sincronizacion():
    """
    Obtiene los logs de sincronización guardados en MongoDB.
    """

    logs = []

    cursor = logs_collection.find().sort(
        "fecha_inicio",
        -1,
    )

    for log in cursor:
        log["_id"] = str(log["_id"])
        logs.append(log)

    return {
        "estado": "completado",
        "cantidad": len(logs),
        "logs": logs,
    }
