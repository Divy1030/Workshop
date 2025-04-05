from django.contrib import admin
from django.urls import path, include
from registration.views import verification_success, verification_error

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('registration.urls')),
    path('verification-success/', verification_success, name='verification-success'),
    path('verification-error/', verification_error, name='verification-error'),
]
