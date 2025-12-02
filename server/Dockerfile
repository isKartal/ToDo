# 1. Python 3.10 yüklü bir Linux imajı kullan
FROM python:3.10-slim

# 2. Çalışma klasörünü ayarla
WORKDIR /app

# 3. Python loglarını anlık görmek için ayar (tamponlama yapma)
ENV PYTHONUNBUFFERED=1

# 4. Gerekli kütüphaneleri kopyala ve kur
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# 5. Proje dosyalarını kopyala
COPY . /app/

# 6. Sunucuyu başlat (Dışarıya açmak için 0.0.0.0 kullanıyoruz)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]