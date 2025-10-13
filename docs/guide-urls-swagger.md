# 🔗 Guide des URLs - Cohérence Swagger vs API Réelle

## 🚨 **PROBLÈME IDENTIFIÉ ET RÉSOLU**

### ❌ **Avant (Problématique)**
- **URLs dans Swagger** : `http://localhost:3000/users`
- **URLs réelles de l'API** : `http://localhost:3000/api/v1/users`
- **Résultat** : Les tests dans Swagger échouaient car mauvaises URLs

### ✅ **Après (Corrigé)**
- **URLs dans Swagger** : `http://localhost:3000/api/v1/users`
- **URLs réelles de l'API** : `http://localhost:3000/api/v1/users`
- **Résultat** : Parfaite cohérence, tests fonctionnels

## 🎯 **Configuration des Serveurs Swagger**

### Serveurs Disponibles
1. **Serveur de développement local** : `http://localhost:3000/api/v1`
2. **Serveur de production** : `https://api.databeez.africa/api/v1`

### Comment Vérifier
1. Ouvrir Swagger : http://localhost:3000/api
2. Regarder le menu déroulant "Servers" en haut à droite
3. S'assurer que `http://localhost:3000/api/v1` est sélectionné

## 🔍 **Structure des URLs**

### Préfixe Global
- **Toutes les URLs** commencent par `/api/v1`
- **Configuration** : `app.setGlobalPrefix('api/v1')` dans `main.ts`

### Endpoints Disponibles

#### 🔐 **Authentification** (`/api/v1/auth`)
- `POST /register` → URL complète : `http://localhost:3000/api/v1/auth/register`
- `POST /login` → URL complète : `http://localhost:3000/api/v1/auth/login`
- `POST /refresh` → URL complète : `http://localhost:3000/api/v1/auth/refresh`
- `POST /logout` → URL complète : `http://localhost:3000/api/v1/auth/logout`
- `POST /validate` → URL complète : `http://localhost:3000/api/v1/auth/validate`

#### 👥 **Utilisateurs** (`/api/v1/users`)
- `POST /` → URL complète : `http://localhost:3000/api/v1/users`
- `GET /` → URL complète : `http://localhost:3000/api/v1/users`
- `GET /me` → URL complète : `http://localhost:3000/api/v1/users/me`
- `GET /:id` → URL complète : `http://localhost:3000/api/v1/users/{id}`
- `PATCH /me` → URL complète : `http://localhost:3000/api/v1/users/me`
- `PATCH /:id` → URL complète : `http://localhost:3000/api/v1/users/{id}`

#### 🏥 **Application** (`/api/v1`)
- `GET /` → URL complète : `http://localhost:3000/api/v1/`
- `GET /health` → URL complète : `http://localhost:3000/api/v1/health`

## 🧪 **Comment Tester Correctement**

### 1. **Vérifier le Serveur**
```
✅ Dans Swagger, sélectionner : http://localhost:3000/api/v1
```

### 2. **Tester un Endpoint**
```
✅ Endpoint : POST /users
✅ URL complète affichée : http://localhost:3000/api/v1/users
✅ Cliquer sur "Try it out"
✅ Remplir les données
✅ Cliquer sur "Execute"
```

### 3. **Vérifier la Réponse**
```
✅ Status Code : 201 (Created)
✅ Response Body : Utilisateur créé avec succès
```

## 🔧 **Configuration Technique**

### Fichier : `src/config/swagger.config.ts`
```typescript
.addServer('http://localhost:3000/api/v1', 'Serveur de développement local (avec préfixe /api/v1)')
.addServer('https://api.databeez.africa/api/v1', 'Serveur de production (avec préfixe /api/v1)')
```

### Fichier : `src/main.ts`
```typescript
// Configuration du préfixe global
app.setGlobalPrefix('api/v1');
```

## 🚨 **Problèmes Courants et Solutions**

### ❌ **Problème 1 : "404 Not Found"**
- **Cause** : Mauvais serveur sélectionné dans Swagger
- **Solution** : Vérifier que `http://localhost:3000/api/v1` est sélectionné

### ❌ **Problème 2 : "Connection Refused"**
- **Cause** : Application non démarrée
- **Solution** : `npm run start:dev`

### ❌ **Problème 3 : "Unauthorized"**
- **Cause** : Token JWT manquant ou expiré
- **Solution** : Utiliser le bouton "Authorize" avec un token valide

## 📋 **Checklist de Vérification**

### Avant de Tester
- [ ] Application démarrée sur le port 3000
- [ ] Serveur Swagger configuré sur `http://localhost:3000/api/v1`
- [ ] Base de données PostgreSQL accessible
- [ ] Redis accessible

### Pendant les Tests
- [ ] URLs affichées commencent par `/api/v1`
- [ ] Endpoints répondent avec les bons codes de statut
- [ ] Réponses JSON sont valides
- [ ] Authentification fonctionne pour les endpoints protégés

## 🎉 **Résultat Attendu**

Avec la configuration corrigée :
- ✅ **Swagger affiche** les bonnes URLs
- ✅ **Tests fonctionnent** directement dans l'interface
- ✅ **Cohérence parfaite** entre documentation et implémentation
- ✅ **Développement plus efficace** avec tests intégrés

---

**Dernière mise à jour** : 14/08/2025  
**Statut** : ✅ Problème résolu, URLs cohérentes 