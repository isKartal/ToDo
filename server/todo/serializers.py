from rest_framework import serializers
from .models import Todo
from django.contrib.auth.models import User

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        # 'category' alanını listeye eklemeyi unutma!
        fields = ('id', 'title', 'description', 'completed', 'category')
        
class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password', 'email')
        extra_kwargs = {'password': {'write_only': True}} # Şifre okunamasın, sadece yazılsın

    def create(self, validated_data):
        # Kullanıcıyı oluştururken şifreyi otomatik hash'le (şifrele)
        user = User.objects.create_user(
            validated_data['username'],
            validated_data['email'],
            validated_data['password']
        )
        return user