FROM node:20.6.1

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

# Construir la app de producción
RUN npm run build

# Instalar servidor web liviano para servir React
RUN npm install -g serve

CMD [ "npm", "run", "dev" ]