# Use an official Node runtime as a parent image
FROM node:14

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install all dependencies, including devDependencies for building
RUN npm install

# Copy the local code to the container image
COPY . .

# Build the React application
RUN npm run build

# Install serve to serve the app on container
RUN npm install -g serve

# Command to run the app
CMD ["serve", "-s", "build", "-l", "8080"]
