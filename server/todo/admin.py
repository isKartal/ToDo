from django.contrib import admin
from .models import Todo  # Modelimizi çağırıyoruz

# Admin panelinde Todo modelini göster
admin.site.register(Todo)