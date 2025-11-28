from django.shortcuts import render
from rest_framework import viewsets          # ViewSet modülünü çağır
from .serializers import TodoSerializer      # Az önce yazdığımız çevirici
from .models import Todo                     # Modelimiz

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer        # "Bu çeviriciyi kullan"
    queryset = Todo.objects.all()            # "Tüm Todo nesnelerini getir"