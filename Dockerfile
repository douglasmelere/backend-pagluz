# Use a imagem oficial do Node.js 20
FROM node:20

# Defina o diretório de trabalho
WORKDIR /app

# Copie package.json e package-lock.json
COPY package*.json ./

# Instale dependências, incluindo devDependencies
RUN npm ci --no-cache

# Copie o código
COPY . .

# Construa o aplicativo
RUN npm run build

# Exponha a porta do aplicativo
EXPOSE 3333

# Aguarde o banco estar disponível antes de iniciar
CMD ["sh", "-c", "until psql -h pagluz-db -U postgres -d pagluz-db -p 5432 -c '\\q'; do echo 'Aguardando banco...'; sleep 2; done; npm start"]