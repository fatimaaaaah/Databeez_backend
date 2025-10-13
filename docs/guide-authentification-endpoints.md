# 🔐 Guide d'Authentification - Pourquoi "Unauthorized" sur tous les Endpoints

## 🚨 **PROBLÈME IDENTIFIÉ :**

### ❌ **Symptôme :**
Tous les endpoints protégés affichent l'erreur **"Unauthorized"** dans Swagger.

### 🔍 **Cause racine :**
Votre admin `Diop.Abdou@example.com` a été créé mais son compte n'est **PAS VÉRIFIÉ** (`isVerified: false`).

## 🎯 **POURQUOI CETTE ERREUR ?**

### ✅ **Système de sécurité fonctionnel :**

1. **Endpoints protégés** : Affichent un cadenas 🔒 dans Swagger
2. **Authentification requise** : Nécessitent un **token JWT valide**
3. **Compte non vérifié** : Ne peut pas se connecter, donc pas de token
4. **Protection automatique** : L'API refuse l'accès sans token valide

### 🔒 **Types d'endpoints dans Swagger :**

#### **Endpoints Publics (sans cadenas) :**
- ✅ `POST /auth/register` - Inscription
- ✅ `POST /auth/login` - Connexion
- ✅ `POST /auth/refresh` - Refresh token
- ✅ `GET /health` - Santé de l'API

#### **Endpoints Protégés (avec cadenas 🔒) :**
- 🔒 `GET /users` - Liste des utilisateurs (Admin)
- 🔒 `GET /users/me` - Profil utilisateur
- 🔒 `PATCH /users/{id}/verify` - Vérifier un compte
- 🔒 Tous les autres endpoints de gestion

## 🛠️ **SOLUTION COMPLÈTE :**

### **Étape 1 : Vérifier l'état de votre admin**

#### **Via PgAdmin (Recommandé) :**
1. **Ouvrir** : http://localhost:5050
2. **Se connecter** : `admin@databeez.com` / `admin123`
3. **Se connecter à la base** :
   - Host: `postgres`
   - Port: `5432`
   - Database: `databeez`
   - Username: `databeez`
   - Password: `databeez123`

4. **Exécuter cette requête :**
```sql
-- Voir l'état actuel
SELECT id, email, role, "isVerified", "isActive" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';
```

### **Étape 2 : Vérifier le compte admin**

#### **Si le compte n'est pas vérifié :**
```sql
-- Vérifier le compte
UPDATE users 
SET "isVerified" = true 
WHERE email = 'Diop.Abdou@example.com';

-- Vérifier le changement
SELECT "isVerified" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';
```

### **Étape 3 : Tester la connexion**

#### **Après vérification, testez :**
```bash
curl -X POST 'http://localhost:3000/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "Diop.Abdou@example.com",
    "motDePasse": "MotDePasse123!"
  }'
```

#### **Réponse attendue :**
```json
{
  "success": true,
  "message": "Connexion réussie",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "cmeb...",
      "email": "Diop.Abdou@example.com",
      "role": "ADMIN",
      "isVerified": true
    }
  }
}
```

## 🔑 **UTILISATION DES TOKENS DANS SWAGGER :**

### **1. Obtenir le token :**
- Utiliser l'endpoint `POST /auth/login`
- Copier le `accessToken` de la réponse

### **2. Autoriser Swagger :**
- Cliquer sur le bouton **"Authorize"** (🔒 vert)
- Entrer : `Bearer {votre_token}`
- Exemple : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **3. Tester les endpoints protégés :**
- Maintenant tous les endpoints avec cadenas fonctionnent
- Plus d'erreur "Unauthorized"

## 📊 **VÉRIFICATION COMPLÈTE :**

### **Script de test automatique :**
```bash
# Vérifier l'état de l'admin
./check-admin-status.sh

# Tester la connexion
./test-final-swagger.sh
```

### **Checklist de vérification :**
- [ ] Compte admin vérifié dans la base (`isVerified: true`)
- [ ] Connexion réussie avec token JWT reçu
- [ ] Bouton "Authorize" configuré dans Swagger
- [ ] Endpoints protégés accessibles
- [ ] Plus d'erreurs "Unauthorized"

## 🚨 **PROBLÈMES COURANTS ET SOLUTIONS :**

### **❌ "Compte non vérifié"**
- **Cause** : `isVerified: false` en base
- **Solution** : Mettre à jour la base via PgAdmin

### **❌ "Token invalide"**
- **Cause** : Token expiré ou mal formaté
- **Solution** : Se reconnecter et obtenir un nouveau token

### **❌ "Accès interdit"**
- **Cause** : Rôle insuffisant pour l'endpoint
- **Solution** : Vérifier que le compte a le rôle ADMIN

### **❌ "PgAdmin inaccessible"**
- **Cause** : Container Docker arrêté
- **Solution** : `docker-compose up -d`

## 🎉 **RÉSULTAT APRÈS VÉRIFICATION :**

### **Dans Swagger :**
- ✅ **Tous les endpoints** fonctionnent
- ✅ **Plus d'erreurs** "Unauthorized"
- ✅ **Tests complets** possibles
- ✅ **Interface utilisable** à 100%

### **Dans l'API :**
- ✅ **Authentification** fonctionnelle
- ✅ **Gestion des rôles** active
- ✅ **Sécurité** renforcée
- ✅ **Développement** efficace

## 🔧 **CONFIGURATION TECHNIQUE :**

### **Fichiers de configuration :**
- **JWT** : `src/config/jwt.config.ts`
- **Guards** : `src/modules/auth/guards/`
- **Stratégies** : `src/modules/auth/strategies/`
- **Décorateurs** : `src/modules/auth/decorators/`

### **Variables d'environnement :**
```bash
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_REFRESH_EXPIRES_IN=30d
```

---

**Dernière mise à jour** : 14/08/2025  
**Statut** : ✅ Guide complet pour résoudre les erreurs Unauthorized 