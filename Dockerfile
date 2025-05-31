# Build stage
FROM node:18-alpine as build

# Set working directory inside the container
WORKDIR /app

# Copy package configuration files
COPY package*.json ./

# Install dependencies using clean install (faster and reproducible)
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the application (e.g., for Vite, React, Vue, etc.)
RUN npm run build

# Debug: list contents of the build output directory
RUN echo "=== DIST CONTENT ===" && ls -la /app/dist/
RUN echo "=== HTML FILES IN DIST ===" && find /app/dist -name "*.html" -exec ls -la {} \;
RUN echo "=== FULL STRUCTURE OF DIST (first 20 files) ===" && find /app/dist -type f | head -20

# Production stage using Nginx
FROM nginx:alpine

# Remove the default Nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from the previous stage
COPY --from=build /app/dist /usr/share/nginx/html

# If the build output is inside a subfolder (like front-golden-eggs), move it to the root
RUN if [ -d "/usr/share/nginx/html/front-golden-eggs" ]; then \
      echo "Moving contents from subfolder front-golden-eggs"; \
      mv /usr/share/nginx/html/front-golden-eggs/* /usr/share/nginx/html/ 2>/dev/null || true; \
      rmdir /usr/share/nginx/html/front-golden-eggs 2>/dev/null || true; \
    fi

# Try other folders: move the one containing index.html to the root
RUN for dir in /usr/share/nginx/html/*/; do \
      if [ -d "$dir" ] && [ -f "$dir/index.html" ]; then \
        echo "Found folder with index.html: $dir"; \
        mv "$dir"* /usr/share/nginx/html/ 2>/dev/null || true; \
        rmdir "$dir" 2>/dev/null || true; \
        break; \
      fi; \
    done

# Debug: final verification of what was placed in Nginx's html folder
RUN echo "=== FINAL CONTENT IN NGINX ===" && ls -la /usr/share/nginx/html/
RUN echo "=== IS index.html PRESENT? ===" && ls -la /usr/share/nginx/html/index.html 2>/dev/null || echo "index.html NOT FOUND"

# Generate Nginx configuration
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

# Expose port 80
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
