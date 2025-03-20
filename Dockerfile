# Stage 1: Build the application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Run the built application
FROM node:22-alpine
WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app ./

# Set environment to production
ENV NODE_ENV=production

# Expose the port your app listens on
EXPOSE 3001

# Start the production server
CMD ["npm", "start"]
