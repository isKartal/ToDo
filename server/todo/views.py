from django.shortcuts import render
from rest_framework import viewsets, permissions, generics, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from .serializers import TodoSerializer, RegisterSerializer
from .models import Todo
from django.contrib.auth.models import User

class TodoView(viewsets.ModelViewSet):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_queryset(self):
        return Todo.objects.filter(owner=self.request.user).order_by('-id')

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        # Sadece bu kullanıcının verileri
        queryset = Todo.objects.filter(owner=self.request.user)
        
        # 1. Tamamlanma Durumu
        total = queryset.count()
        completed = queryset.filter(completed=True).count()
        pending = total - completed

        # 2. Kategori Dağılımı
        categories = {
            "is": queryset.filter(category="is").count(),
            "okul": queryset.filter(category="okul").count(),
            "kisisel": queryset.filter(category="kisisel").count(),
            "diger": queryset.filter(category="diger").count(),
        }

        return Response({
            "total": total,
            "completed": completed,
            "pending": pending,
            "categories": categories
        })

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer