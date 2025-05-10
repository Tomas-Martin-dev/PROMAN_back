FROM node:22

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# Asegura que tsc tenga permisos de ejecución
RUN chmod +x ./node_modules/.bin/tsc

# Compilar TypeScript
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
