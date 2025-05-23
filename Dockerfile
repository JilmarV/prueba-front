# Etapa de construcción - Aquí se instalan dependencias y se construye la app
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de producción - Solo necesitamos los archivos estáticos
FROM alpine:latest

WORKDIR /app
COPY --from=builder /app/dist /app/static

# Expone el puerto (aunque Traefik manejará el routing)
EXPOSE 80

CMD ["sh", "-c", "echo 'Frontend files ready to be served by Traefik' && tail -f /dev/null"]