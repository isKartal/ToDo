from django.db import models

# Seçenekleri tanımlıyoruz (Sol taraf veritabanına, sağ taraf ekrana yazılır)
CATEGORY_CHOICES = (
    ('kisisel', 'Kişisel'),
    ('is', 'İş'),
    ('okul', 'Okul'),
    ('diger', 'Diğer'),
)

class Todo(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    # YENİ EKLENEN ALAN:
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='diger')
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title