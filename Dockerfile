# Use an official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (to leverage Docker caching)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install -g expo-cli && npm install

# Copy the rest of the project
COPY . .

# Expose the Expo Web port (default 8081)
EXPOSE 8081

# Start the Expo web server
CMD ["npm", "run", "web"]
