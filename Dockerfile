# 1. Use official Node.js image as base
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Install dependencies
COPY package.json package-lock.json* ./
RUN npm install

# 4. Copy project files
COPY . .

# 5. Build Next.js app
RUN npm run build

# 6. Expose the port Next.js runs on
EXPOSE 3000

# 7. Start the app
CMD ["npm", "start"]
