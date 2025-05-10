# Imagen base oficial de Node.js
FROM node:22

# Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de dependencia
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código al contenedor
COPY . .

# Exponer el puerto (ajústalo si tu app usa otro)
EXPOSE 4333

# Comando para iniciar la app
CMD ["npm", "start"]
