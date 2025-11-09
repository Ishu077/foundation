# Multi-stage Dockerfile for Node.js/Express Backend

# ============================================
# Stage 1: Development
# ============================================
FROM node:20-alpine AS development

# Set working directory
WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including devDependencies)
RUN npm ci

# Copy application code
COPY backend/ .

# Expose port
EXPOSE 8080

# Start development server with nodemon for hot reload
CMD ["npx", "nodemon", "server.js"]


# ============================================
# Stage 2: Production Dependencies
# ============================================
FROM node:20-alpine AS dependencies

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install only production dependencies
RUN npm ci --only=production


# ============================================
# Stage 3: Production
# ============================================
FROM node:20-alpine AS production

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy production dependencies from dependencies stage
COPY --from=dependencies /app/node_modules ./node_modules

# Copy application code
COPY backend/ .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Note: Runtime environment variables (FRONTEND_URL, MONGO_URL, JWT_SECRET, etc.)
# should be set in the deployment platform (Render, Docker Compose, etc.)
# They are read by the application at runtime, not during build

# Start production server
CMD ["node", "server.js"]

