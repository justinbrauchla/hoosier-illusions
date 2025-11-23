# Production stage - use pre-built dist
FROM node:20-alpine
WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --production

# Copy built files and server
COPY dist ./dist
COPY server.js ./

EXPOSE 8080

CMD ["node", "server.js"]
