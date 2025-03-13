# Stage 1: Builder
# Use the official Node.js image as the base
FROM node:22 AS builder

# Create a working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
# COPY package*.json ./

# Copy the app's source code into the container
COPY . .

# Install deps
RUN npm i

# Epxlicitly clean existing .next if present
# RUN rm -rf .next

# Stage 2: Runner
FROM node:22

WORKDIR /app
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package*.json ./
RUN npm i

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["npm", "run", "dev"]
