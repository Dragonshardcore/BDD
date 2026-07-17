from datetime import date, datetime, time, timezone
def autor_sql_to_json(autor):
    return {
        "id_sql": autor.id,
        "nombres": autor.nombres,
        "apellidos": autor.apellidos,
        "nacionalidad": autor.nacionalidad,
        "fecha_nacimiento": fecha_a_bson(
            autor.fecha_nacimiento
        ),
        "biografia": autor.biografia,
        "imagen_url": autor.imagen_url,
        "activo": autor.activo,
        "creado_en": fecha_a_bson(autor.creado_en),
        "actualizado_en": fecha_a_bson(autor.actualizado_en),
    }

def libro_sql_to_json(libro):
    return {
        "id_sql": libro.id,
        "titulo": libro.titulo,
        "isbn": libro.isbn,
        "genero": libro.genero,
        "anio_publicacion": libro.anio_publicacion,
        "descripcion": libro.descripcion,
        "imagen_url": libro.imagen_url,
        "cantidad_total": libro.cantidad_total,
        "cantidad_disponible": libro.cantidad_disponible,
        "activo": libro.activo,
        "creado_en": fecha_a_bson(libro.creado_en),
        "actualizado_en": fecha_a_bson(libro.actualizado_en),

        "autor": {
            "id_sql": libro.autor.id,
            "nombres": libro.autor.nombres,
            "apellidos": libro.autor.apellidos,
            "nacionalidad": libro.autor.nacionalidad,
        }
    }
    
def reserva_sql_to_json(reserva):
    return {
        "id_sql": reserva.id,
        "usuario": reserva.usuario,
        "fecha_reserva": fecha_a_bson(
            reserva.fecha_reserva
        ),
        "fecha_devolucion": fecha_a_bson(
            reserva.fecha_devolucion
        ),
        "estado": reserva.estado,
        "activo": reserva.activo,
        "creado_en": fecha_a_bson(reserva.creado_en),
        "actualizado_en": fecha_a_bson(
            reserva.actualizado_en
        ),

        "libro": {
            "id_sql": reserva.libro.id,
            "titulo": reserva.libro.titulo,
            "isbn": reserva.libro.isbn,
        }
    }




def fecha_a_bson(valor):
    """
    Convierte datetime.date a datetime.datetime para que MongoDB
    pueda almacenarlo como una fecha BSON.
    """
    if valor is None:
        return None

    if isinstance(valor, datetime):
        return valor

    if isinstance(valor, date):
        return datetime.combine(
            valor,
            time.min,
            tzinfo=timezone.utc
        )

    return valor