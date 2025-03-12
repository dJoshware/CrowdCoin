# Use the official Node.js image as the base
FROM node:22

# Create a working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the working directory
COPY package*.json ./

# Install deps
RUN npm install

# Copy the app's source code into the container
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Run the app
CMD ["npm", "run", "dev"]
