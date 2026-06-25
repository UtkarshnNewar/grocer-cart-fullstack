FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other source code
COPY . .

# Expose the Express port
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
