FROM node:22

WORKDIR /usr/src/app

COPY . .

RUN npm ci

# Asegura que tsc tenga permisos de ejecución
RUN chmod +x ./node_modules/.bin/tsc

# Compilar TypeScript
RUN npm run build

# Verifica que el build generó el archivo
RUN ls -la dist

EXPOSE 3000

CMD ["npm", "start"]