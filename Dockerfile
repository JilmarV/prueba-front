# Etapa de construcción
FROM node:18-alpine as build

WORKDIR /app

# Copiar archivos de configuración
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Debug: ver qué se generó
RUN echo "=== CONTENIDO DE DIST ===" && ls -la /app/dist/
RUN echo "=== ARCHIVOS HTML EN DIST ===" && find /app/dist -name "*.html" -exec ls -la {} \;
RUN echo "=== ESTRUCTURA COMPLETA DIST ===" && find /app/dist -type f | head -20

# Etapa de producción
FROM nginx:alpine

# Eliminar contenido por defecto de nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiar archivos construidos - intentar varias opciones
COPY --from=build /app/dist /usr/share/nginx/html

# Si existe una subcarpeta, moverla al root
RUN if [ -d "/usr/share/nginx/html/front-golden-eggs" ]; then \
      echo "Moviendo archivos de subcarpeta front-golden-eggs"; \
      mv /usr/share/nginx/html/front-golden-eggs/* /usr/share/nginx/html/ 2>/dev/null || true; \
      rmdir /usr/share/nginx/html/front-golden-eggs 2>/dev/null || true; \
    fi

# Intentar con otras posibles carpetas
RUN for dir in /usr/share/nginx/html/*/; do \
      if [ -d "$dir" ] && [ -f "$dir/index.html" ]; then \
        echo "Encontrada carpeta con index.html: $dir"; \
        mv "$dir"* /usr/share/nginx/html/ 2>/dev/null || true; \
        rmdir "$dir" 2>/dev/null || true; \
        break; \
      fi; \
    done

# Debug: ver qué quedó en nginx
RUN echo "=== CONTENIDO FINAL NGINX ===" && ls -la /usr/share/nginx/html/
RUN echo "=== INDEX.HTML EXISTE? ===" && ls -la /usr/share/nginx/html/index.html 2>/dev/null || echo "NO EXISTE index.html"

# Crear configuración de nginx
RUN echo 'server {\
    listen 80;\
    server_name localhost;\
    root /usr/share/nginx/html;\
    index index.html index.htm;\
\
    location / {\
        try_files $uri $uri/ /index.html;\
        add_header Cache-Control "no-cache, no-store, must-revalidate";\
        add_header Pragma "no-cache";\
        add_header Expires "0";\
    }\
\
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {\
        expires 1y;\
        add_header Cache-Control "public, immutable";\
    }\
\
    location /api/ {\
        proxy_pass http://api:8000/;\
        proxy_set_header Host $host;\
        proxy_set_header X-Real-IP $remote_addr;\
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\
        proxy_set_header X-Forwarded-Proto $scheme;\
        proxy_redirect off;\
    }\
\
    gzip on;\
    gzip_vary on;\
    gzip_min_length 1024;\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\
}' > /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando por defecto
CMD ["nginx", "-g", "daemon off;"]