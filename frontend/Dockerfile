# awesome-form-app/frontend/Dockerfile

FROM node:20-alpine AS build

WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html

# Reverse proxy to backend
RUN sed -i 's|#gzip on;|location /api/ { proxy_pass http://backend:5000/; }|' /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
