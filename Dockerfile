# Stage 1: Build the Angular application
FROM node:20.17.0 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npx ngcc --properties es2023 browser module main --first-only --create-ivy-entry-points

# Copy the rest of the application code
COPY . .

# Build the Angular application in production mode
RUN npm run build

# Stage 2: Serve the application with NGINX
FROM nginx:1.27.2

# RUN rm /etc/nginx/conf.d/default.conf
# Copy a custom NGINX configuration file
COPY nginx.conf /etc/nginx/conf.d

# Copy the build output to NGINX's HTML directory
COPY --from=build /app/dist/ui/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
