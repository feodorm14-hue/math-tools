FROM node:20-alpine

WORKDIR /app

# Зависимости
COPY package*.json ./
RUN npm install

# Исходный код
COPY . .

# Запуск Vite dev-сервера (доступен снаружи контейнера)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
