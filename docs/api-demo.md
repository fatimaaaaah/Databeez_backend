# 🐝 Démonstration de l'API Databeez

## 🚀 Démarrage rapide

### 1. Accéder à Swagger
Ouvrez votre navigateur et allez sur : `http://localhost:3000/api`

### 2. Tester l'API sans authentification

#### Endpoint de santé
```bash
curl -X GET "http://localhost:3000/api/v1/health"
```

**Réponse attendue :**
```json
{
  "status": "OK",
  "timestamp": "2024-08-14T19:00:00.000Z"
}
```

#### Inscription d'un utilisateur
```bash
curl -X POST "http://localhost:3000/api/v1/users" \
  -H "Content-Type: application/json" \
  -d '{
    "numeroTelephone": "+2250701234567",
    "nom": "Kouassi",
    "prenom": "Khar",
    "email": "khar.kouassi@example.com",
    "motDePasse": "MotDePasse123!",
    "role": "MENTEE"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Utilisateur créé avec succès",
  "data": {
    "id": "clx1234567890abcdef",
    "numeroTelephone": "+2250701234567",
    "nom": "Kouassi",
    "prenom": "Khar",
    "email": "khar.kouassi@example.com",
    "role": "MENTEE",
    "isVerified": false,
    "isActive": true
  }
}
```

### 3. Authentification

#### Connexion
```bash
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "identifier": "khar.kouassi@example.com",
    "password": "MotDePasse123!"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": "7d",
    "user": {
      "id": "clx1234567890abcdef",
      "email": "khar.kouassi@example.com",
      "role": "MENTEE"
    }
  }
}
```

### 4. Utilisation avec authentification

#### Récupérer le profil utilisateur
```bash
curl -X GET "http://localhost:3000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

#### Mettre à jour le profil
```bash
curl -X PATCH "http://localhost:3000/api/v1/users/me" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Kouassi",
    "prenom": "Khar",
    "photoProfil": "https://example.com/photo.jpg"
  }'
```

## 🔐 Gestion des tokens JWT

### Structure du token
Le token JWT contient les informations suivantes :
- `sub` : ID de l'utilisateur
- `email` : Email de l'utilisateur
- `role` : Rôle de l'utilisateur
- `iat` : Date de création
- `exp` : Date d'expiration

### Rafraîchir le token
```bash
curl -X POST "http://localhost:3000/api/v1/auth/refresh" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Déconnexion
```bash
curl -X POST "http://localhost:3000/api/v1/auth/logout" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Test des endpoints protégés

### Endpoints Admin (rôle ADMIN requis)
```bash
# Lister tous les utilisateurs
curl -X GET "http://localhost:3000/api/v1/users" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Vérifier un utilisateur
curl -X PATCH "http://localhost:3000/api/v1/users/USER_ID/verify" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"

# Désactiver un utilisateur
curl -X PATCH "http://localhost:3000/api/v1/users/USER_ID/deactivate" \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🧪 Test avec Swagger UI

### 1. Ouvrir Swagger
Allez sur `http://localhost:3000/api`

### 2. Authentification
1. Cliquez sur le bouton **"Authorize"** en haut
2. Entrez votre token : `Bearer YOUR_JWT_TOKEN`
3. Cliquez sur **"Authorize"**

### 3. Tester un endpoint
1. Cliquez sur l'endpoint que vous voulez tester
2. Cliquez sur **"Try it out"**
3. Remplissez les paramètres
4. Cliquez sur **"Execute"**

## 🚨 Gestion des erreurs

### Codes de statut HTTP
- `200` : Succès
- `201` : Créé
- `400` : Requête invalide
- `401` : Non authentifié
- `403` : Accès interdit
- `404` : Non trouvé
- `409` : Conflit
- `500` : Erreur serveur

### Exemples d'erreurs

#### Validation échouée (400)
```json
{
  "message": [
    "Le numéro de téléphone doit être au format international",
    "Le mot de passe doit contenir au moins 8 caractères"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

#### Non authentifié (401)
```json
{
  "message": "Token JWT invalide ou expiré",
  "error": "Unauthorized",
  "statusCode": 401
}
```

#### Accès interdit (403)
```json
{
  "message": "Vous n'avez pas les permissions nécessaires",
  "error": "Forbidden",
  "statusCode": 403
}
```

## 🔍 Débogage

### Vérifier les logs de l'application
```bash
# Voir les processus en cours
ps aux | grep ts-node

# Vérifier le port utilisé
sudo lsof -i :3000
```

### Tester la base de données
```bash
# Se connecter à PostgreSQL
sudo docker exec -it databeez-postgres psql -U databeez -d databeez

# Lister les tables
\dt

# Voir les utilisateurs
SELECT * FROM users LIMIT 5;
```

### Tester Redis
```bash
# Se connecter à Redis
sudo docker exec -it databeez-redis redis-cli

# Tester la connexion
ping

# Voir les clés
keys *
```

## 📚 Ressources

- **Interface Swagger** : http://localhost:3000/api
- **Guide Swagger** : `docs/swagger-guide.md`
- **Script de test** : `test-api.sh`
- **Documentation Prisma** : https://www.prisma.io/docs/
- **Documentation NestJS** : https://docs.nestjs.com/

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez les logs de l'application
2. Consultez la documentation Swagger
3. Testez avec le script `test-api.sh`
4. Créez une issue sur GitHub
5. Contactez l'équipe Databeez 