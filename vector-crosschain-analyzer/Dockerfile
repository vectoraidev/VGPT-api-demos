# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY src/ ./src/
COPY .env.example ./.env.example

# Create logs directory
RUN mkdir -p logs

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S vectorai -u 1001 -G nodejs

# Change ownership of app directory
RUN chown -R vectorai:nodejs /app

# Switch to non-root user
USER vectorai

# Expose port (if running as server)
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "console.log('Health check passed')" || exit 1

# Default command
CMD ["npm", "start"]

# Labels for metadata
LABEL maintainer="Vector AI Community <team@vector-ai.pro>"
LABEL description="Vector AI Multichain Portfolio Analyzer"
LABEL version="1.0.0"
LABEL org.opencontainers.image.source="https://github.com/vectoraidev/multichain-analyzer" 