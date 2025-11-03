FROM node:20-alpine

WORKDIR /app

# Copy files
COPY . ./

# Install dependencies (postinstall will run prisma generate)
RUN npm ci

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]

