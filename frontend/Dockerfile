# 1. Node.js yüklü imaj kullan
FROM node:18-alpine

# 2. Çalışma klasörü
WORKDIR /app

# 3. Paket listesini kopyala ve yükle
COPY package.json package-lock.json ./
RUN npm install

# 4. Kodları kopyala
COPY . .

# 5. React'i başlat
CMD ["npm", "start"]