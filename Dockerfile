# Utiliser l'image Node.js officielle
FROM node:18-alpine

# Créer le répertoire de l'application
WORKDIR /usr/src/app

# Copier les fichiers de dépendances
COPY package*.json ./
COPY prisma ./prisma/

# Installer les dépendances
RUN npm ci --only=production

# Générer le client Prisma
RUN npx prisma generate

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Exposer le port
EXPOSE 3000

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

# Changer la propriété des fichiers
RUN chown -R nestjs:nodejs /usr/src/app
USER nestjs

# Commande de démarrage
CMD ["npm", "run", "start:prod"] 