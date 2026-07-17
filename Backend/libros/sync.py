from datetime import datetime, timezone

from django.db import transaction
from django.utils import timezone as django_timezone

from .models import Autor, Libro, Reserva
from .mapping import (
    autor_sql_to_json,
    libro_sql_to_json,
    reserva_sql_to_json,
)
from .mongo import (
    autores_collection,
    libros_collection,
    reservas_collection,
    logs_collection,
)


# ============================================================
# FUNCIONES AUXILIARES
# ============================================================

def normalizar_datetime(valor):
    """
    Convierte un datetime de PostgreSQL o MongoDB a UTC.
    Devuelve None cuando el valor no es un datetime válido.
    """
    if valor is None:
        return None

    if not isinstance(valor, datetime):
        return None

    if django_timezone.is_naive(valor):
        return django_timezone.make_aware(
            valor,
            timezone=timezone.utc
        )

    return valor.astimezone(timezone.utc)


def fecha_mongo_a_date(valor):
    """
    Convierte un datetime BSON de MongoDB a date para Django.
    """
    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor.date()

    return valor


def postgres_es_mas_reciente(fecha_postgres, fecha_mongo):
    """
    Devuelve True cuando PostgreSQL tiene la versión más reciente.
    """
    fecha_postgres = normalizar_datetime(fecha_postgres)
    fecha_mongo = normalizar_datetime(fecha_mongo)

    if fecha_postgres is None:
        return False

    if fecha_mongo is None:
        return True

    return fecha_postgres > fecha_mongo


def mongo_es_mas_reciente(fecha_mongo, fecha_postgres):
    """
    Devuelve True cuando MongoDB tiene la versión más reciente.
    """
    fecha_mongo = normalizar_datetime(fecha_mongo)
    fecha_postgres = normalizar_datetime(fecha_postgres)

    if fecha_mongo is None:
        return False

    if fecha_postgres is None:
        return True

    return fecha_mongo > fecha_postgres


def sincronizar_documento_postgres_a_mongo(
    coleccion,
    objeto,
    documento
):
    """
    Sincroniza un objeto de PostgreSQL hacia MongoDB.

    Regla de conflicto:
    - Si PostgreSQL es más reciente, actualiza MongoDB.
    - Si MongoDB es más reciente, no lo sobrescribe.
    - Si las fechas son iguales, no realiza cambios.
    """
    documento_mongo = coleccion.find_one({
        "id_sql": objeto.id
    })

    datos_mongo = {
        **documento,
        "origen": "postgresql",
        "sincronizado_en": datetime.now(timezone.utc)
    }

    if documento_mongo is None:
        coleccion.update_one(
            {"id_sql": objeto.id},
            {"$set": datos_mongo},
            upsert=True
        )

        return "creado"

    fecha_postgres = objeto.actualizado_en
    fecha_mongo = documento_mongo.get("actualizado_en")

    if postgres_es_mas_reciente(
        fecha_postgres,
        fecha_mongo
    ):
        coleccion.update_one(
            {"_id": documento_mongo["_id"]},
            {"$set": datos_mongo}
        )

        return "actualizado"

    if mongo_es_mas_reciente(
        fecha_mongo,
        fecha_postgres
    ):
        return "conflicto_mongo_mas_reciente"

    return "sin_cambios"


def registrar_estado(resultado, estado):
    """
    Incrementa el contador correspondiente al resultado
    de una sincronización PostgreSQL → MongoDB.
    """
    if estado == "creado":
        resultado["creados"] += 1

    elif estado == "actualizado":
        resultado["actualizados"] += 1

    elif estado == "sin_cambios":
        resultado["sin_cambios"] += 1

    elif estado == "conflicto_mongo_mas_reciente":
        resultado["conflictos"] += 1

def contar_errores(resultado):
    """
    Cuenta todos los errores producidos durante una
    sincronización completa.
    """
    total = 0

    for datos_entidad in resultado.values():
        total += len(datos_entidad.get("errores", []))

    return total


def contar_conflictos(resultado):
    """
    Cuenta todos los conflictos detectados durante
    una sincronización completa.
    """
    total = 0

    for datos_entidad in resultado.values():
        total += datos_entidad.get("conflictos", 0)

    return total


def registrar_log_sincronizacion(
    origen,
    destino,
    resultado,
    estado="completado",
    error_general=None
):
    """
    Guarda en MongoDB un registro de cada sincronización.
    """
    documento_log = {
        "fecha_inicio": datetime.now(timezone.utc),
        "origen": origen,
        "destino": destino,
        "estado": estado,
        "resultado": resultado,
        "total_errores": contar_errores(resultado),
        "total_conflictos": contar_conflictos(resultado),
        "error_general": error_general,
    }

    registro = logs_collection.insert_one(documento_log)

    return str(registro.inserted_id)


# ============================================================
# POSTGRESQL → MONGODB
# ============================================================

def sincronizar_autores_postgres_a_mongo():
    autores = Autor.objects.all()

    resultado = {
        "procesados": autores.count(),
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for autor in autores:
        try:
            documento = autor_sql_to_json(autor)

            estado = sincronizar_documento_postgres_a_mongo(
                autores_collection,
                autor,
                documento
            )

            registrar_estado(resultado, estado)

        except Exception as error:
            resultado["errores"].append({
                "id_sql": autor.id,
                "error": str(error)
            })

    return resultado


def sincronizar_postgres_a_mongo():
    """
    Sincroniza libros desde PostgreSQL hacia MongoDB.
    Se conserva este nombre porque ya lo utiliza el proyecto.
    """
    libros = Libro.objects.select_related("autor").all()

    resultado = {
        "procesados": libros.count(),
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for libro in libros:
        try:
            documento = libro_sql_to_json(libro)

            estado = sincronizar_documento_postgres_a_mongo(
                libros_collection,
                libro,
                documento
            )

            registrar_estado(resultado, estado)

        except Exception as error:
            resultado["errores"].append({
                "id_sql": libro.id,
                "error": str(error)
            })

    return resultado


def sincronizar_reservas_postgres_a_mongo():
    reservas = Reserva.objects.select_related("libro").all()

    resultado = {
        "procesados": reservas.count(),
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for reserva in reservas:
        try:
            documento = reserva_sql_to_json(reserva)

            estado = sincronizar_documento_postgres_a_mongo(
                reservas_collection,
                reserva,
                documento
            )

            registrar_estado(resultado, estado)

        except Exception as error:
            resultado["errores"].append({
                "id_sql": reserva.id,
                "error": str(error)
            })

    return resultado


def sincronizar_todo_postgres_a_mongo():
    """
    Ejecuta la sincronización completa PostgreSQL → MongoDB
    y registra el resultado en logs_sincronizacion.
    """
    try:
        resultado = {
            "autores": sincronizar_autores_postgres_a_mongo(),
            "libros": sincronizar_postgres_a_mongo(),
            "reservas": sincronizar_reservas_postgres_a_mongo(),
        }

        total_errores = contar_errores(resultado)

        estado = (
            "completado"
            if total_errores == 0
            else "completado_con_errores"
        )

        log_id = registrar_log_sincronizacion(
            origen="postgresql",
            destino="mongodb",
            resultado=resultado,
            estado=estado
        )

        return {
            "direccion": "postgresql_a_mongodb",
            "estado": estado,
            "log_id": log_id,
            "resultado": resultado
        }

    except Exception as error:
        resultado_vacio = {
            "autores": {
                "errores": []
            },
            "libros": {
                "errores": []
            },
            "reservas": {
                "errores": []
            }
        }

        log_id = registrar_log_sincronizacion(
            origen="postgresql",
            destino="mongodb",
            resultado=resultado_vacio,
            estado="fallido",
            error_general=str(error)
        )

        return {
            "direccion": "postgresql_a_mongodb",
            "estado": "fallido",
            "log_id": log_id,
            "error": str(error)
        }


# ============================================================
# MONGODB → POSTGRESQL: AUTORES
# ============================================================

def sincronizar_autores_mongo_a_postgres():
    documentos = autores_collection.find({})

    resultado = {
        "procesados": 0,
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for documento in documentos:
        resultado["procesados"] += 1
        id_sql = documento.get("id_sql")

        try:
            datos = {
                "nombres": documento.get(
                    "nombres",
                    ""
                ).strip(),
                "apellidos": documento.get(
                    "apellidos",
                    ""
                ).strip(),
                "nacionalidad": documento.get(
                    "nacionalidad",
                    ""
                ),
                "fecha_nacimiento": fecha_mongo_a_date(
                    documento.get("fecha_nacimiento")
                ),
                "biografia": documento.get(
                    "biografia",
                    ""
                ),
                "imagen_url": documento.get(
                    "imagen_url",
                    ""
                ),
                "activo": documento.get(
                    "activo",
                    True
                ),
            }

            with transaction.atomic():
                autor = None

                if id_sql:
                    autor = Autor.objects.filter(
                        id=id_sql
                    ).first()

                if autor:
                    fecha_mongo = documento.get(
                        "actualizado_en"
                    )
                    fecha_postgres = autor.actualizado_en

                    if mongo_es_mas_reciente(
                        fecha_mongo,
                        fecha_postgres
                    ):
                        for campo, valor in datos.items():
                            setattr(autor, campo, valor)

                        autor.save()

                        fecha_mongo_normalizada = (
                            normalizar_datetime(fecha_mongo)
                        )

                        if fecha_mongo_normalizada:
                            Autor.objects.filter(
                                id=autor.id
                            ).update(
                                actualizado_en=(
                                    fecha_mongo_normalizada
                                )
                            )

                        resultado["actualizados"] += 1

                    elif postgres_es_mas_reciente(
                        fecha_postgres,
                        fecha_mongo
                    ):
                        resultado["conflictos"] += 1

                    else:
                        resultado["sin_cambios"] += 1

                    continue

                autor_existente = Autor.objects.filter(
                    nombres=datos["nombres"],
                    apellidos=datos["apellidos"]
                ).first()

                if autor_existente:
                    autores_collection.update_one(
                        {"_id": documento["_id"]},
                        {
                            "$set": {
                                "id_sql": autor_existente.id
                            }
                        }
                    )

                    resultado["sin_cambios"] += 1
                    continue

                nuevo_autor = Autor.objects.create(**datos)

                autores_collection.update_one(
                    {"_id": documento["_id"]},
                    {
                        "$set": {
                            "id_sql": nuevo_autor.id,
                            "origen": "mongodb",
                            "actualizado_en": (
                                nuevo_autor.actualizado_en
                            ),
                            "sincronizado_en": datetime.now(
                                timezone.utc
                            )
                        }
                    }
                )

                resultado["creados"] += 1

        except Exception as error:
            resultado["errores"].append({
                "mongo_id": str(
                    documento.get("_id")
                ),
                "id_sql": id_sql,
                "error": str(error)
            })

    return resultado


# ============================================================
# MONGODB → POSTGRESQL: LIBROS
# ============================================================

def sincronizar_mongo_a_postgres():
    """
    Sincroniza libros desde MongoDB hacia PostgreSQL.
    Se conserva este nombre porque ya lo utiliza el proyecto.
    """
    documentos = libros_collection.find({})

    resultado = {
        "procesados": 0,
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for documento in documentos:
        resultado["procesados"] += 1
        id_sql = documento.get("id_sql")

        try:
            autor_documento = documento.get(
                "autor",
                {}
            )
            autor_id_sql = autor_documento.get(
                "id_sql"
            )

            if not autor_id_sql:
                resultado["errores"].append({
                    "mongo_id": str(
                        documento.get("_id")
                    ),
                    "id_sql": id_sql,
                    "error": (
                        "El libro no contiene autor.id_sql."
                    )
                })
                continue

            autor = Autor.objects.filter(
                id=autor_id_sql
            ).first()

            if not autor:
                resultado["errores"].append({
                    "mongo_id": str(
                        documento.get("_id")
                    ),
                    "id_sql": id_sql,
                    "autor_id_sql": autor_id_sql,
                    "error": (
                        "El autor relacionado no existe "
                        "en PostgreSQL."
                    )
                })
                continue

            datos = {
                "autor": autor,
                "titulo": documento.get(
                    "titulo",
                    ""
                ).strip(),
                "isbn": documento.get(
                    "isbn",
                    ""
                ),
                "genero": documento.get(
                    "genero",
                    ""
                ),
                "anio_publicacion": documento.get(
                    "anio_publicacion"
                ),
                "descripcion": documento.get(
                    "descripcion",
                    ""
                ),
                "imagen_url": documento.get(
                    "imagen_url",
                    ""
                ),
                "cantidad_total": documento.get(
                    "cantidad_total",
                    0
                ),
                "cantidad_disponible": documento.get(
                    "cantidad_disponible",
                    0
                ),
                "activo": documento.get(
                    "activo",
                    True
                ),
            }

            with transaction.atomic():
                libro = None

                if id_sql:
                    libro = Libro.objects.filter(
                        id=id_sql
                    ).first()

                if libro:
                    fecha_mongo = documento.get(
                        "actualizado_en"
                    )
                    fecha_postgres = libro.actualizado_en

                    if mongo_es_mas_reciente(
                        fecha_mongo,
                        fecha_postgres
                    ):
                        for campo, valor in datos.items():
                            setattr(libro, campo, valor)

                        libro.save()

                        fecha_mongo_normalizada = (
                            normalizar_datetime(fecha_mongo)
                        )

                        if fecha_mongo_normalizada:
                            Libro.objects.filter(
                                id=libro.id
                            ).update(
                                actualizado_en=(
                                    fecha_mongo_normalizada
                                )
                            )

                        resultado["actualizados"] += 1

                    elif postgres_es_mas_reciente(
                        fecha_postgres,
                        fecha_mongo
                    ):
                        resultado["conflictos"] += 1

                    else:
                        resultado["sin_cambios"] += 1

                    continue

                isbn = datos.get("isbn")
                libro_existente = None

                if isbn:
                    libro_existente = Libro.objects.filter(
                        isbn=isbn
                    ).first()

                if libro_existente:
                    libros_collection.update_one(
                        {"_id": documento["_id"]},
                        {
                            "$set": {
                                "id_sql": libro_existente.id
                            }
                        }
                    )

                    resultado["sin_cambios"] += 1
                    continue

                nuevo_libro = Libro.objects.create(**datos)

                libros_collection.update_one(
                    {"_id": documento["_id"]},
                    {
                        "$set": {
                            "id_sql": nuevo_libro.id,
                            "origen": "mongodb",
                            "actualizado_en": (
                                nuevo_libro.actualizado_en
                            ),
                            "sincronizado_en": datetime.now(
                                timezone.utc
                            )
                        }
                    }
                )

                resultado["creados"] += 1

        except Exception as error:
            resultado["errores"].append({
                "mongo_id": str(
                    documento.get("_id")
                ),
                "id_sql": id_sql,
                "error": str(error)
            })

    return resultado


# ============================================================
# MONGODB → POSTGRESQL: RESERVAS
# ============================================================

def sincronizar_reservas_mongo_a_postgres():
    documentos = reservas_collection.find({})

    resultado = {
        "procesados": 0,
        "creados": 0,
        "actualizados": 0,
        "sin_cambios": 0,
        "conflictos": 0,
        "errores": []
    }

    for documento in documentos:
        resultado["procesados"] += 1
        id_sql = documento.get("id_sql")

        try:
            libro_documento = documento.get(
                "libro",
                {}
            )
            libro_id_sql = libro_documento.get(
                "id_sql"
            )

            if not libro_id_sql:
                resultado["errores"].append({
                    "mongo_id": str(
                        documento.get("_id")
                    ),
                    "id_sql": id_sql,
                    "error": (
                        "La reserva no contiene libro.id_sql."
                    )
                })
                continue

            libro = Libro.objects.filter(
                id=libro_id_sql
            ).first()

            if not libro:
                resultado["errores"].append({
                    "mongo_id": str(
                        documento.get("_id")
                    ),
                    "id_sql": id_sql,
                    "libro_id_sql": libro_id_sql,
                    "error": (
                        "El libro relacionado no existe "
                        "en PostgreSQL."
                    )
                })
                continue

            datos = {
                "libro": libro,
                "usuario": documento.get(
                    "usuario",
                    ""
                ).strip(),
                "fecha_reserva": fecha_mongo_a_date(
                    documento.get("fecha_reserva")
                ),
                "fecha_devolucion": fecha_mongo_a_date(
                    documento.get("fecha_devolucion")
                ),
                "estado": documento.get(
                    "estado",
                    "activa"
                ),
                "activo": documento.get(
                    "activo",
                    True
                ),
            }

            with transaction.atomic():
                reserva = None

                if id_sql:
                    reserva = Reserva.objects.filter(
                        id=id_sql
                    ).first()

                if reserva:
                    fecha_mongo = documento.get(
                        "actualizado_en"
                    )
                    fecha_postgres = (
                        reserva.actualizado_en
                    )

                    if mongo_es_mas_reciente(
                        fecha_mongo,
                        fecha_postgres
                    ):
                        for campo, valor in datos.items():
                            setattr(reserva, campo, valor)

                        reserva.save()

                        fecha_mongo_normalizada = (
                            normalizar_datetime(fecha_mongo)
                        )

                        if fecha_mongo_normalizada:
                            Reserva.objects.filter(
                                id=reserva.id
                            ).update(
                                actualizado_en=(
                                    fecha_mongo_normalizada
                                )
                            )

                        resultado["actualizados"] += 1

                    elif postgres_es_mas_reciente(
                        fecha_postgres,
                        fecha_mongo
                    ):
                        resultado["conflictos"] += 1

                    else:
                        resultado["sin_cambios"] += 1

                    continue

                nueva_reserva = Reserva.objects.create(
                    **datos
                )

                reservas_collection.update_one(
                    {"_id": documento["_id"]},
                    {
                        "$set": {
                            "id_sql": nueva_reserva.id,
                            "origen": "mongodb",
                            "actualizado_en": (
                                nueva_reserva.actualizado_en
                            ),
                            "sincronizado_en": datetime.now(
                                timezone.utc
                            )
                        }
                    }
                )

                resultado["creados"] += 1

        except Exception as error:
            resultado["errores"].append({
                "mongo_id": str(
                    documento.get("_id")
                ),
                "id_sql": id_sql,
                "error": str(error)
            })

    return resultado


def sincronizar_todo_mongo_a_postgres():
    """
    Ejecuta la sincronización completa MongoDB → PostgreSQL.

    El orden es importante:
    1. Autores
    2. Libros
    3. Reservas

    También registra el resultado en logs_sincronizacion.
    """
    try:
        resultado = {
            "autores": sincronizar_autores_mongo_a_postgres(),
            "libros": sincronizar_mongo_a_postgres(),
            "reservas": sincronizar_reservas_mongo_a_postgres(),
        }

        total_errores = contar_errores(resultado)

        estado = (
            "completado"
            if total_errores == 0
            else "completado_con_errores"
        )

        log_id = registrar_log_sincronizacion(
            origen="mongodb",
            destino="postgresql",
            resultado=resultado,
            estado=estado
        )

        return {
            "direccion": "mongodb_a_postgresql",
            "estado": estado,
            "log_id": log_id,
            "resultado": resultado
        }

    except Exception as error:
        resultado_vacio = {
            "autores": {
                "errores": []
            },
            "libros": {
                "errores": []
            },
            "reservas": {
                "errores": []
            }
        }

        log_id = registrar_log_sincronizacion(
            origen="mongodb",
            destino="postgresql",
            resultado=resultado_vacio,
            estado="fallido",
            error_general=str(error)
        )

        return {
            "direccion": "mongodb_a_postgresql",
            "estado": "fallido",
            "log_id": log_id,
            "error": str(error)
        }