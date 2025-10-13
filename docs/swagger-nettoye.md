# 📚 Documentation Swagger Nettoyée - Databeez API

## 🎯 Vue d'ensemble

La documentation Swagger a été nettoyée pour ne contenir que les endpoints réellement implémentés et fonctionnels. Les modules vides ont été supprimés pour éviter la confusion.

## 🏗️ Structure de l'API

### Sections Disponibles

#### 1. 🔐 **auth** - Authentification et Gestion des Tokens
- **POST** `/api/v1/auth/register` - Inscription d'un nouvel utilisateur
- **POST** `/api/v1/auth/login` - Connexion utilisateur
- **POST** `/api/v1/auth/refresh` - Rafraîchir le token d'accès
- **POST** `/api/v1/auth/logout` - Déconnexion utilisateur
- **POST** `/api/v1/auth/validate` - Valider un token

#### 2. 👥 **users** - Gestion des Utilisateurs, Profils et Comptes
- **POST** `/api/v1/users` - Créer un nouvel utilisateur
- **GET** `/api/v1/users` - Récupérer tous les utilisateurs (Admin uniquement)
- **GET** `/api/v1/users/me` - Récupérer le profil de l'utilisateur connecté
- **GET** `/api/v1/users/:id` - Récupérer un utilisateur par ID
- **PATCH** `/api/v1/users/me` - Mettre à jour le profil utilisateur
- **PATCH** `/api/v1/users/:id` - Mettre à jour un utilisateur (Admin uniquement)
- **DELETE** `/api/v1/users/:id` - Supprimer un utilisateur (Admin uniquement)
- **PATCH** `/api/v1/users/:id/verify` - Vérifier un compte utilisateur
- **PATCH** `/api/v1/users/:id/deactivate` - Désactiver un compte
- **PATCH** `/api/v1/users/:id/activate` - Réactiver un compte

#### 3. 🏥 **app** - Endpoints de Santé et Monitoring de l'API
- **GET** `/api/v1/` - Vérifier le statut de l'API
- **GET** `/api/v1/health` - Vérifier la santé de l'API

## 🚀 Accès à la Documentation

- **URL Swagger UI** : http://localhost:3000/api
- **URL API Base** : http://localhost:3000/api/v1
- **Port** : 3000

## 🔑 Authentification

### Endpoints Publics (sans authentification)
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `GET /api/v1/`
- `GET /api/v1/health`

### Endpoints Protégés (avec JWT)
- Tous les autres endpoints nécessitent un token JWT valide
- Utilisez le bouton "Authorize" dans Swagger avec le format : `Bearer <votre_token>`

## 📊 Modèles de Données (DTOs)

### CreateUserDto
```json
{
  "numeroTelephone": "+2250701234567",
  "nom": "Kouassi",
  "prenom": "Khar",
  "email": "khar.kouassi@example.com",
  "motDePasse": "MotDePasse123!",
  "role": "MENTEE"
}
```

### UserResponseDto
```json
{
  "id": "clx1234567890abcdef",
  "numeroTelephone": "+2250701234567",
  "nom": "Kouassi",
  "prenom": "Khar",
  "email": "khar.kouassi@example.com",
  "role": "MENTEE",
  "isVerified": true,
  "isActive": true
}
```

## 🧪 Tests

### Script de Test Automatisé
```bash
./test-swagger-clean.sh
```

Ce script teste :
- ✅ Endpoint de santé
- ✅ Création d'utilisateur
- ✅ Tentative de connexion (compte non vérifié)

### Test Manuel via Swagger
1. Ouvrir http://localhost:3000/api
2. Tester les endpoints publics d'abord
3. Créer un utilisateur via `/api/v1/auth/register`
4. Tester la connexion via `/api/v1/auth/login`

## 🚧 Modules à Implémenter (Futur)

Les modules suivants ont été temporairement supprimés et seront réimplémentés progressivement :

- **Matching** - Algorithme de mise en relation mentor/mentee
- **Sessions** - Gestion des sessions de mentorat
- **Payments** - Système de paiement et gestion des crédits
- **Notifications** - Système de notifications et rappels
- **Analytics** - Métriques, KPIs et dashboard administrateur

## 📝 Notes de Développement

- **Base de données** : PostgreSQL avec Prisma ORM
- **Cache** : Redis pour les sessions et données temporaires
- **Validation** : class-validator pour la validation des données
- **Tests** : Jest pour les tests unitaires et E2E
- **Documentation** : Swagger/OpenAPI 3.0

## 🔧 Configuration

### Variables d'Environnement Requises
```bash
DATABASE_URL="postgresql://databeez:databeez123@localhost:5432/databeez?schema=public"
JWT_SECRET="your-super-secret-jwt-key-here"
JWT_EXPIRES_IN="7d"
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=3000
```

### Démarrage
```bash
# Démarrage des services
docker-compose up -d

# Génération Prisma
npm run db:generate

# Migration de la base
npm run db:push

# Démarrage de l'application
npm run start:dev
```

---

**Dernière mise à jour** : 14/08/2025  
**Version** : 1.0.0  
**Statut** : Documentation nettoyée et fonctionnelle 