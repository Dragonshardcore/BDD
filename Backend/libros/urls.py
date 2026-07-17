from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # ViewSets PostgreSQL
    LibroViewSet,
    ReservaViewSet,
    AutorViewSet,

    # Sincronización
    sincronizar_mongo,
    sincronizar_postgres,

    # MongoDB - Libros
    listar_libros_mongo,
    crear_libro_mongo,
    actualizar_libro_mongo,
    eliminar_libro_mongo,

    # MongoDB - Autores
    listar_autores_mongo,
    crear_autor_mongo,
    actualizar_autor_mongo,
    eliminar_autor_mongo,

    # MongoDB - Reservas
    listar_reservas_mongo,
    crear_reserva_mongo,
    actualizar_reserva_mongo,
    eliminar_reserva_mongo,
)

# =====================================================
# Router DRF (PostgreSQL)
# =====================================================

router = DefaultRouter()

router.register(r'libros', LibroViewSet)
router.register(r'reservas', ReservaViewSet)
router.register(r'autores', AutorViewSet)

# =====================================================
# URLs
# =====================================================

urlpatterns = [

    # PostgreSQL (DRF)
    path('', include(router.urls)),


    # =================================================
    # Sincronización
    # =================================================
    path(
        'sync/postgres-mongo/',
        sincronizar_mongo,
        name='sync-postgres-mongo'
    ),
    path(
    'sync/mongo-postgres/',
     sincronizar_postgres,
    name='sync-mongo-postgres'
    ),
    


    # =================================================
    # MongoDB - AUTORES
    # =================================================
    path(
        'mongo/autores/',
        listar_autores_mongo,
        name='listar-autores-mongo'
    ),

    path(
        'mongo/autores/crear/',
        crear_autor_mongo,
        name='crear-autor-mongo'
    ),

    path(
        'mongo/autores/<str:id>/',
        actualizar_autor_mongo,
        name='actualizar-autor-mongo'
    ),

    path(
        'mongo/autores/eliminar/<str:id>/',
        eliminar_autor_mongo,
        name='eliminar-autor-mongo'
    ),


    # =================================================
    # MongoDB - LIBROS
    # =================================================
    path(
        'mongo/libros/',
        listar_libros_mongo,
        name='listar-libros-mongo'
    ),

    path(
        'mongo/libros/crear/',
        crear_libro_mongo,
        name='crear-libro-mongo'
    ),

    path(
        'mongo/libros/<str:id>/',
        actualizar_libro_mongo,
        name='actualizar-libro-mongo'
    ),

    path(
        'mongo/libros/eliminar/<str:id>/',
        eliminar_libro_mongo,
        name='eliminar-libro-mongo'
    ),


    # =================================================
    # MongoDB - RESERVAS
    # =================================================
    path(
        'mongo/reservas/',
        listar_reservas_mongo,
        name='listar-reservas-mongo'
    ),

    path(
        'mongo/reservas/crear/',
        crear_reserva_mongo,
        name='crear-reserva-mongo'
    ),

    path(
        'mongo/reservas/<str:id>/',
        actualizar_reserva_mongo,
        name='actualizar-reserva-mongo'
    ),

    path(
        'mongo/reservas/eliminar/<str:id>/',
        eliminar_reserva_mongo,
        name='eliminar-reserva-mongo'
    ),
]
