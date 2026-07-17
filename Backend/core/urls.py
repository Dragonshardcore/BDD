from django.contrib import admin
from django.urls import path, include

urlpatterns = [

    path(
        'admin/',
        admin.site.urls
    ),

    # OAuth2
    path(
        'o/',
        include(
            'oauth2_provider.urls',
            namespace='oauth2_provider'
        )
    ),

    # API
    path(
        'api/',
        include('libros.urls')
    ),
]