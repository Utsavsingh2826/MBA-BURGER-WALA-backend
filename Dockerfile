# 1️⃣ Use an official Node.js image
FROM node:18-alpine

# 2️⃣ Set the working directory inside the container
WORKDIR /app

# 3️⃣ Copy package.json and package-lock.json first (for efficient caching)
COPY package*.json ./

# 4️⃣ Install dependencies
RUN npm install

# 5️⃣ Copy the rest of the application files
COPY . .

# 6️⃣ Expose the port your backend is running on (e.g., 5000)
EXPOSE 5000

# 7️⃣ Use environment variable to start the app in dev or prod mode
CMD ["npm", "run", "start"]
