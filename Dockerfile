FROM node:18 as build

WORKDIR /app

COPY . .

RUN npm install --legacy-peer-deps

# Corrected build command
RUN npm run build -- --configuration=production 

# Stage 2
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
