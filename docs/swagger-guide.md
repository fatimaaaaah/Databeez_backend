# 🐝 Guide d'utilisation de Swagger - API Databeez

## 📖 Vue d'ensemble

Cette documentation explique comment utiliser l'interface Swagger pour tester et explorer l'API Databeez.

## 🚀 Accès à Swagger

Une fois l'application démarrée, accédez à la documentation Swagger via :
```
http://localhost:3000/api
```

## 🔐 Authentification

### 1. Obtenir un token JWT

1. **Inscription** : Utilisez l'endpoint `POST /auth/register` pour créer un compte
2. **Connexion** : Utilisez l'endpoint `POST /auth/login` pour obtenir un token
3. **Copier le token** : Dans la réponse, copiez la valeur de `accessToken`

### 2. Configurer l'authentification

1. Cliquez sur le bouton **"Authorize"** en haut de la page Swagger
2. Dans le champ **"Value"**, entrez : `Bearer <votre_token>`
3. Cliquez sur **"Authorize"** puis **"Close"**

Exemple :
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🧪 Tester les endpoints

### Endpoints publics (sans authentification)
- `POST /auth/register` - Inscription
- `POST /auth/login` - Connexion
- `POST /auth/refresh` - Rafraîchir le token
- `GET /health` - Vérifier la santé de l'API

### Endpoints protégés (avec authentification)
- `GET /users/me` - Profil utilisateur connecté
- `PATCH /users/me` - Mettre à jour le profil
- `GET /users/:id` - Récupérer un utilisateur par ID

### Endpoints Admin (rôle ADMIN requis)
- `GET /users` - Liste de tous les utilisateurs
- `PATCH /users/:id` - Modifier un utilisateur
- `DELETE /users/:id` - Supprimer un utilisateur

## 📝 Exemples de requêtes

### 1. Inscription d'un utilisateur

```json
POST /auth/register
{
  "numeroTelephone": "+2250701234567",
  "nom": "Kouassi",
  "prenom": "Khar",
  "email": "khar.kouassi@example.com",
  "password": "MotDePasse123!",
  "role": "MENTEE"
}
```

### 2. Connexion

```json
POST /auth/login
{
  "identifier": "khar.kouassi@example.com",
  "password": "MotDePasse123!"
}
```

### 3. Mise à jour du profil

```json
PATCH /users/me
{
  "nom": "Kouassi",
  "prenom": "Khar",
  "photoProfil": "https://example.com/photo.jpg"
}
```

## 🔍 Fonctionnalités Swagger

### Filtrage
- Utilisez la barre de recherche pour filtrer les endpoints
- Cliquez sur les tags pour voir les endpoints par catégorie

### Test en temps réel
- Cliquez sur un endpoint pour l'étendre
- Cliquez sur **"Try it out"**
- Remplissez les paramètres
- Cliquez sur **"Execute"**

### Documentation des modèles
- Cliquez sur **"Schemas"** en bas de la page
- Explorez les structures de données des DTOs

## 🚨 Codes de statut HTTP

| Code | Signification | Description |
|------|---------------|-------------|
| 200 | OK | Requête réussie |
| 201 | Created | Ressource créée avec succès |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Authentification requise |
| 403 | Forbidden | Permissions insuffisantes |
| 404 | Not Found | Ressource non trouvée |
| 409 | Conflict | Conflit avec une ressource existante |
| 500 | Internal Server Error | Erreur serveur |

## 🛠️ Dépannage

### Problème : "401 Unauthorized"
- Vérifiez que le token JWT est valide
- Assurez-vous d'avoir cliqué sur "Authorize"
- Vérifiez que le token n'a pas expiré

### Problème : "403 Forbidden"
- Vérifiez que votre utilisateur a le bon rôle
- Certains endpoints nécessitent le rôle ADMIN

### Problème : "400 Bad Request"
- Vérifiez le format des données envoyées
- Consultez la documentation des DTOs dans "Schemas"

## 📚 Ressources supplémentaires

- **Documentation NestJS** : https://docs.nestjs.com/
- **Documentation Swagger** : https://swagger.io/docs/
- **Documentation Prisma** : https://www.prisma.io/docs/

## 🆘 Support

Pour toute question ou problème :
- Créez une issue sur GitHub
- Contactez l'équipe Databeez : support@databeez.africa
- Consultez les logs de l'application pour plus de détails

---

**Note** : Cette documentation est mise à jour régulièrement. Vérifiez toujours la dernière version dans l'interface Swagger. 