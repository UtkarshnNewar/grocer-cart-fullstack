FROM node:20

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all other source code
COPY . .

# Expose the Next.js port
EXPOSE 3000

# Run in development mode for hot-reloading
CMD ["npm", "run", "dev"]
