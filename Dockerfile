FROM node:18

WORKDIR /app

# Copiar os ficheiros do npm primeiro (boa prática)
COPY package*.json ./

RUN npm install

# Copiar o resto do projecto
COPY . .

CMD ["npm", "run", "start"]
