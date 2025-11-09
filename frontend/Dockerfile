# Multi-stage Dockerfile for React/Vite Frontend

# ============================================
# Stage 1: Development
# ============================================
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install all dependencies
RUN npm ci

# Copy application code
COPY frontend/ .

# Expose Vite dev server port
EXPOSE 5173

# Start Vite dev server with hot reload
# --host 0.0.0.0 allows access from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# ============================================
# Stage 2: Build
# ============================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY frontend/package*.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY frontend/ .

# Accept VITE_API_URL as build argument
ARG VITE_API_URL=http://localhost:8080

# Build the application with VITE_API_URL
RUN VITE_API_URL=$VITE_API_URL npm run build


# ============================================
# Stage 3: Production (Node.js static server)
# ============================================
FROM node:20-alpine AS production

WORKDIR /app

# Install serve package globally to serve static files
RUN npm install -g serve

# Copy built files from build stage
COPY --from=build /app/dist ./dist

# Expose port 5173 (same as dev for consistency)
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhos?t:5173/ || exit 1

# Serve the built application
CMD ["serve", "-s", "dist", "-l", "5173"]

