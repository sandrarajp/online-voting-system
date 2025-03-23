"""voting_system URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LoginView
from django.conf import settings  
from django.conf.urls.static import static
from dashboard.views import ElectionView, ElectionResultsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("", include("landing_page.urls")),
    path("login/", LoginView.as_view(), name="login"),
    path("dashboard/", include("dashboard.urls")),
    path("election/<int:id>", ElectionView.as_view(), name="election_url"),
    path("election/<int:id>/ballot", ElectionView.as_view()),
    path("election/<int:id>/results", ElectionResultsView.as_view(), name="results_url"),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
#    path('accounts/', include('django.contrib.auth.urls')),
]  #+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns

    # Serve static and media files from development server
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
