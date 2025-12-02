from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        # 'category' alanını listeye eklemeyi unutma!
        fields = ('id', 'title', 'description', 'completed', 'category')