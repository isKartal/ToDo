from django.db import models
from django.contrib.auth.models import User  # Kullanıcı modelini çağır

CATEGORY_CHOICES = (
    ('kisisel', 'Kişisel'),
    ('is', 'İş'),
    ('okul', 'Okul'),
    ('diger', 'Diğer'),
)

class Todo(models.Model):
    # YENİ: Her görevin bir sahibi olacak.
    # on_delete=models.CASCADE: Kullanıcı silinirse görevleri de silinsin.
    owner = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    
    title = models.CharField(max_length=120)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='diger')
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title