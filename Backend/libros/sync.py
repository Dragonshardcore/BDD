from datetime import datetime, timezone

from pymongo.errors import PyMongoError

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
)


def sincronizar_postgres_a_mongo():
    libros = Libro.objects.select_related("autor").all()

    creados = 0
    actualizados = 0
    sin_cambios = 0
    errores = []

    for libro in libros:
        try:
            documento = libro_sql_to_json(libro)

            documento["origen"] = "postgresql"
            documento["sincronizado_en"] = datetime.now(timezone.utc)

            resultado = libros_collection.update_one(
                {"id_sql": libro.id},
                {"$set": documento},
                upsert=True
            )

            if resultado.upserted_id is not None:
                creados += 1

            elif resultado.modified_count > 0:
                actualizados += 1

            else:
                sin_cambios += 1

        except PyMongoError as error:
            errores.append({
                "id_sql": libro.id,
                "error": str(error)
            })

    return {
        "procesados": libros.count(),
        "creados": creados,
        "actualizados": actualizados,
        "sin_cambios": sin_cambios,
        "errores": errores
    }
    
    
def sincronizar_mongo_a_postgres():
    documentos = libros_collection.find({"activo": True})

    creados = 0
    actualizados = 0
    errores = []

    for doc in documentos:
        try:
            id_sql = doc.get("id_sql")

            if not id_sql:
                continue

            libro = Libro.objects.filter(id=id_sql).first()

            if libro:
                libro.titulo = doc.get("titulo", libro.titulo)
                libro.isbn = doc.get("isbn", libro.isbn)
                libro.genero = doc.get("genero", libro.genero)
                libro.anio_publicacion = doc.get(
                    "anio_publicacion",
                    libro.anio_publicacion
                )
                libro.descripcion = doc.get(
                    "descripcion",
                    libro.descripcion
                )
                libro.imagen_url = doc.get(
                    "imagen_url",
                    libro.imagen_url
                )
                libro.cantidad_total = doc.get(
                    "cantidad_total",
                    libro.cantidad_total
                )
                libro.cantidad_disponible = doc.get(
                    "cantidad_disponible",
                    libro.cantidad_disponible
                )
                libro.activo = doc.get(
                    "activo",
                    libro.activo
                )

                libro.save()

                actualizados += 1

            else:
                errores.append(
                    {
                        "id_sql": id_sql,
                        "error": "Libro no encontrado en PostgreSQL"
                    }
                )

        except Exception as e:
            errores.append(
                {
                    "id_sql": doc.get("id_sql"),
                    "error": str(e)
                }
            )

    return {
        "actualizados": actualizados,
        "creados": creados,
        "errores": errores
    }


def sincronizar_autores_postgres_a_mongo():
    autores = Autor.objects.all()

    creados = 0
    actualizados = 0
    errores = []

    for autor in autores:
        try:
            documento = autor_sql_to_json(autor)

            documento["origen"] = "postgresql"
            documento["sincronizado_en"] = datetime.now(timezone.utc)

            resultado = autores_collection.update_one(
                {"id_sql": autor.id},
                {"$set": documento},
                upsert=True
            )

            if resultado.upserted_id is not None:
                creados += 1
            elif resultado.modified_count > 0:
                actualizados += 1

        except PyMongoError as error:
            errores.append({
                "id_sql": autor.id,
                "error": str(error)
            })

    return {
        "procesados": autores.count(),
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores
    }


def sincronizar_reservas_postgres_a_mongo():
    reservas = Reserva.objects.select_related("libro").all()

    creados = 0
    actualizados = 0
    errores = []

    for reserva in reservas:
        try:
            documento = reserva_sql_to_json(reserva)

            documento["origen"] = "postgresql"
            documento["sincronizado_en"] = datetime.now(timezone.utc)

            resultado = reservas_collection.update_one(
                {"id_sql": reserva.id},
                {"$set": documento},
                upsert=True
            )

            if resultado.upserted_id is not None:
                creados += 1
            elif resultado.modified_count > 0:
                actualizados += 1

        except PyMongoError as error:
            errores.append({
                "id_sql": reserva.id,
                "error": str(error)
            })

    return {
        "procesados": reservas.count(),
        "creados": creados,
        "actualizados": actualizados,
        "errores": errores
    }

def sincronizar_todo_postgres_a_mongo():
    return {
        "autores": sincronizar_autores_postgres_a_mongo(),
        "libros": sincronizar_postgres_a_mongo(),
        "reservas": sincronizar_reservas_postgres_a_mongo(),
    }


def fecha_mongo_a_date(valor):
    """
    Convierte una fecha BSON datetime al tipo date de Django.
    """
    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor.date()

    return valor


def sincronizar_autores_mongo_a_postgres():
    documentos = autores_collection.find({})

    creados = 0
    actualizados = 0
    omitidos = 0
    errores = []

    for documento in documentos:
        id_sql = documento.get("id_sql")

        try:
            with transaction.atomic():
                datos = {
                    "nombres": documento.get("nombres", "").strip(),
                    "apellidos": documento.get("apellidos", "").strip(),
                    "nacionalidad": documento.get(
                        "nacionalidad",
                        ""
                    ),
                    "fecha_nacimiento": fecha_mongo_a_date(
                        documento.get("fecha_nacimiento")
                    ),
                    "biografia": documento.get("biografia", ""),
                    "imagen_url": documento.get("imagen_url", ""),
                    "activo": documento.get("activo", True),
                }

                if id_sql:
                    autor = Autor.objects.filter(id=id_sql).first()

                    if autor:
                        for campo, valor in datos.items():
                            setattr(autor, campo, valor)

                        autor.save()
                        actualizados += 1
                        continue

                # Documento creado directamente en MongoDB
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

                    omitidos += 1
                    continue

                nuevo_autor = Autor.objects.create(**datos)

                autores_collection.update_one(
                    {"_id": documento["_id"]},
                    {
                        "$set": {
                            "id_sql": nuevo_autor.id,
                            "origen": "mongodb"
                        }
                    }
                )

                creados += 1

        except Exception as error:
            errores.append({
                "mongo_id": str(documento.get("_id")),
                "id_sql": id_sql,
                "error": str(error)
            })

    return {
        "creados": creados,
        "actualizados": actualizados,
        "omitidos": omitidos,
        "errores": errores
    }
    
def sincronizar_reservas_mongo_a_postgres():
    documentos = reservas_collection.find({})

    creados = 0
    actualizados = 0
    omitidos = 0
    errores = []

    for documento in documentos:
        id_sql = documento.get("id_sql")

        try:
            libro_documento = documento.get("libro", {})
            libro_id_sql = libro_documento.get("id_sql")

            if not libro_id_sql:
                omitidos += 1
                errores.append({
                    "mongo_id": str(documento.get("_id")),
                    "error": "La reserva no contiene libro.id_sql."
                })
                continue

            libro = Libro.objects.filter(id=libro_id_sql).first()

            if not libro:
                omitidos += 1
                errores.append({
                    "mongo_id": str(documento.get("_id")),
                    "libro_id_sql": libro_id_sql,
                    "error": "El libro relacionado no existe en PostgreSQL."
                })
                continue

            datos = {
                "libro": libro,
                "usuario": documento.get("usuario", "").strip(),
                "fecha_reserva": fecha_mongo_a_date(
                    documento.get("fecha_reserva")
                ),
                "fecha_devolucion": fecha_mongo_a_date(
                    documento.get("fecha_devolucion")
                ),
                "estado": documento.get("estado", "activa"),
                "activo": documento.get("activo", True),
            }

            with transaction.atomic():
                if id_sql:
                    reserva = Reserva.objects.filter(
                        id=id_sql
                    ).first()

                    if reserva:
                        for campo, valor in datos.items():
                            setattr(reserva, campo, valor)

                        reserva.save()
                        actualizados += 1
                        continue

                nueva_reserva = Reserva.objects.create(**datos)

                reservas_collection.update_one(
                    {"_id": documento["_id"]},
                    {
                        "$set": {
                            "id_sql": nueva_reserva.id,
                            "origen": "mongodb"
                        }
                    }
                )

                creados += 1

        except Exception as error:
            errores.append({
                "mongo_id": str(documento.get("_id")),
                "id_sql": id_sql,
                "error": str(error)
            })

    return {
        "creados": creados,
        "actualizados": actualizados,
        "omitidos": omitidos,
        "errores": errores
    }

def sincronizar_todo_mongo_a_postgres():
    return {
        "autores": sincronizar_autores_mongo_a_postgres(),
        "libros": sincronizar_mongo_a_postgres(),
        "reservas": sincronizar_reservas_mongo_a_postgres(),
    }