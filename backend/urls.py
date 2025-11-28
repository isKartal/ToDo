from django.contrib import admin
from django.urls import path, include                # include'u eklemeyi unutma
from rest_framework import routers                   # Router modülü
from todo import views                               # todo view'larını çağır

# Router nesnesi oluşturuyoruz
router = routers.DefaultRouter()
# Router'a diyoruz ki: 'todos' adresine gelindiğinde TodoView çalışsın
router.register(r'todos', views.TodoView, 'todo')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),              # API adreslerini ana yola bağlıyoruz
]