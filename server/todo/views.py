from django.shortcuts import render
from rest_framework import viewsets, permissions
from .serializers import TodoSerializer
from .models import Todo

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    # Kural 1: Sadece giriş yapmış kullanıcılar API'ye erişebilir
    permission_classes = [permissions.IsAuthenticated]

    # Kural 2: Listeleme yaparken filtre uygula
    def get_queryset(self):
        # Sadece isteği yapan kullanıcının (self.request.user) kayıtlarını döndür
        return Todo.objects.filter(owner=self.request.user).order_by('-id')

    # Kural 3: Yeni kayıt eklerken 'owner' alanını otomatik doldur
    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)