# Stage 1: Build the Angular app
FROM node:lts-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all application files and build the Angular project
COPY . .
RUN npx nx build widget-ui --configuration production

# Stage 2: Serve the Angular app using Nginx
FROM nginx:alpine

# Copy the built application from the previous stage
COPY --from=build /app/dist/apps/widget-ui /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 and set the entrypoint
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]
