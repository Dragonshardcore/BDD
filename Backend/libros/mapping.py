def libro_sql_to_json(libro):
    return {
        "id_sql": libro.id,
        "titulo": libro.titulo,
        "genero": libro.genero,
        "anio_publicacion": libro.anio_publicacion,
        "descripcion": libro.descripcion,
        "imagen_url": libro.imagen_url,

        "autor": {
            "id": libro.autor.id,
            "nombres": libro.autor.nombres,
            "apellidos": libro.autor.apellidos,
            "nacionalidad": libro.autor.nacionalidad,
        }
    }