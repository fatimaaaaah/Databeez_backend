# 📚 Documentation API Databeez

## 🔗 Base URL
```
http://localhost:3000/api/v1
```

## 🔐 Authentification

L'API utilise l'authentification JWT. Incluez le token dans l'en-tête Authorization :

```
Authorization: Bearer <votre_token_jwt>
```

## 📋 Endpoints

### 🔑 Authentification

#### POST /auth/register
Inscription d'un nouvel utilisateur

**Body:**
```json
{
  "numeroTelephone": "+2250701234567",
  "nom": "Kouassi",
  "prenom": "Khar",
  "email": "khar.kouassi@example.com",
  "motDePasse": "MotDePasse123!",
  "role": "USER"
}
```

**Réponse:**
```json
{
  "success": true,
  "message": "Inscription réussie",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 604800,
    "user": {
      "id": "clx1234567890",
      "numeroTelephone": "+2250701234567",
      "nom": "Kouassi",
      "prenom": "Khar",
      "email": "khar.kouassi@example.com",
      "role": "USER",
      "dateInscription": "2024-01-15T10:00:00.000Z",
      "isActive": true,
      "isVerified": false
    }
  }
}
```

#### POST /auth/login
Connexion utilisateur

**Body:**
```json
{
  "identifier": "khar.kouassi@example.com",
  "password": "MotDePasse123!"
}
```

#### POST /auth/refresh
Rafraîchir le token d'accès

**Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST /auth/logout
Déconnexion utilisateur

**Headers:** `Authorization: Bearer <token>`

### 👤 Utilisateurs

#### GET /users/me
Récupérer le profil de l'utilisateur connecté

**Headers:** `Authorization: Bearer <token>`

#### PATCH /users/me
Mettre à jour le profil de l'utilisateur connecté

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "nom": "Nouveau Nom",
  "prenom": "Nouveau Prénom"
}
```

#### GET /users/:id
Récupérer un utilisateur par ID

**Headers:** `Authorization: Bearer <token>`

#### GET /users
Récupérer tous les utilisateurs (Admin uniquement)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `page`: Numéro de page (défaut: 1)
- `limit`: Nombre d'éléments par page (défaut: 10, max: 100)
- `search`: Recherche textuelle
- `sortBy`: Champ de tri
- `sortOrder`: Ordre de tri (asc/desc)

## 📊 Codes de Statut

- `200` : Succès
- `201` : Créé
- `204` : Pas de contenu
- `400` : Requête invalide
- `401` : Non autorisé
- `403` : Accès interdit
- `404` : Non trouvé
- `409` : Conflit
- `500` : Erreur serveur

## 🔒 Rôles et Permissions

- **USER** : Utilisateur de base
- **MENTOR** : Expert proposant ses services
- **MENTEE** : Jeune professionnel cherchant du mentorat
- **ADMIN** : Administrateur de la plateforme

## 📱 Spécificités Mobile

- Support des notifications push
- Interface responsive
- Optimisation pour connexions lentes
- Cache Redis pour améliorer les performances

## 🌍 Support Multilingue

- Français (par défaut)
- Anglais
- Langues locales africaines

## 💳 Paiements

- Orange Money
- Moov Money
- MTN Mobile Money
- Cartes bancaires
- Virements

## 🚀 Démarrage Rapide

1. **Démarrer les services**
```bash
docker-compose up -d
```

2. **Configurer l'environnement**
```bash
cp env.example .env
# Éditer .env avec vos configurations
```

3. **Installer les dépendances**
```bash
npm install
```

4. **Générer le client Prisma**
```bash
npm run db:generate
```

5. **Démarrer l'application**
```bash
npm run start:dev
```

6. **Accéder à la documentation**
```
http://localhost:3000/api
```

## 📞 Support

Pour toute question ou problème :
- **Email** : support@databeez.africa
- **Issues** : [GitHub Issues](https://github.com/AbdouazizDEV/Databeez-Back/issues)
- **Documentation** : [Wiki du projet](https://github.com/AbdouazizDEV/Databeez-Back/wiki) 