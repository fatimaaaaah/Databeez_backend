# 🔐 Système de Vérification des Comptes - Databeez

## 🎯 **Pourquoi cette vérification ?**

### ✅ **Sécurité de la plateforme :**
- **Protection contre** les comptes malveillants
- **Contrôle d'accès** par les administrateurs
- **Validation** des informations utilisateur
- **Prévention** des abus et spam

### 🚨 **Comportement par défaut :**
- **Nouveaux comptes** : `isVerified: false`
- **Comptes vérifiés** : `isVerified: true`
- **Seuls les comptes vérifiés** peuvent se connecter

## 🔍 **Problème rencontré :**

### ❌ **Erreur lors de la connexion :**
```json
{
  "message": "Compte non vérifié",
  "error": "Unauthorized",
  "statusCode": 401
}
```

### 📋 **Cause :**
Votre admin a été créé avec succès mais son compte n'est pas encore **vérifié**.

## 🛠️ **Solutions pour vérifier le compte :**

### **Option 1 : Via PgAdmin (Recommandée pour le développement)**

#### 1. **Accéder à PgAdmin**
- **URL** : http://localhost:5050
- **Email** : `admin@databeez.com`
- **Mot de passe** : `admin123`

#### 2. **Se connecter à la base**
- **Host** : `postgres` (nom du container)
- **Port** : `5432`
- **Database** : `databeez`
- **Username** : `databeez`
- **Password** : `databeez123`

#### 3. **Exécuter la requête SQL**
```sql
-- Voir l'état actuel
SELECT id, email, role, "isVerified" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';

-- Vérifier le compte
UPDATE users 
SET "isVerified" = true 
WHERE email = 'Diop.Abdou@example.com';

-- Vérifier le changement
SELECT id, email, role, "isVerified" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';
```

### **Option 2 : Via l'API (Plus propre en production)**

#### 1. **Obtenir un token d'admin existant**
```bash
# Utiliser l'admin du seed
curl -X POST 'http://localhost:3000/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "admin@databeez.com",
    "motDePasse": "Admin123!"
  }'
```

#### 2. **Vérifier le compte avec le token**
```bash
# Remplacer {USER_ID} et {TOKEN} par les vraies valeurs
curl -X PATCH 'http://localhost:3000/api/v1/users/{USER_ID}/verify' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer {TOKEN}'
```

### **Option 3 : Re-seeder la base (Plus simple pour le développement)**

```bash
# Arrêter l'application
pkill -f "ts-node src/main.ts"

# Vider la base
npx prisma db push --force-reset

# Re-seeder
npm run db:seed

# Redémarrer
npm run start:dev
```

## 🔄 **Flux de vérification normal :**

### **En Production :**
1. **Utilisateur s'inscrit** → Compte créé avec `isVerified: false`
2. **Admin vérifie** → Met `isVerified: true`
3. **Utilisateur peut se connecter** → Authentification réussie

### **En Développement :**
1. **Utilisateur s'inscrit** → Compte créé avec `isVerified: false`
2. **Développeur vérifie** → Via PgAdmin ou API
3. **Tests fonctionnels** → Authentification réussie

## 📊 **Vérification dans la base :**

### **Requête pour voir tous les utilisateurs :**
```sql
SELECT 
  id, 
  email, 
  role, 
  "isVerified", 
  "isActive",
  "createdAt"
FROM users 
ORDER BY "createdAt" DESC;
```

### **Requête pour voir les comptes non vérifiés :**
```sql
SELECT 
  id, 
  email, 
  role, 
  "createdAt"
FROM users 
WHERE "isVerified" = false;
```

## 🧪 **Test après vérification :**

### **1. Vérifier que le compte est vérifié :**
```sql
SELECT "isVerified" FROM users WHERE email = 'Diop.Abdou@example.com';
-- Doit retourner : true
```

### **2. Tester la connexion :**
```bash
curl -X POST 'http://localhost:3000/api/v1/auth/login' \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "Diop.Abdou@example.com",
    "motDePasse": "MotDePasse123!"
  }'
```

### **3. Réponse attendue :**
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

## 🚨 **Problèmes courants :**

### **❌ "Connection refused"**
- **Cause** : PgAdmin non accessible
- **Solution** : `docker-compose up -d`

### **❌ "Authentication failed"**
- **Cause** : Mauvais identifiants PgAdmin
- **Solution** : Vérifier le docker-compose.yml

### **❌ "Table users does not exist"**
- **Cause** : Base non initialisée
- **Solution** : `npm run db:push`

## 🎉 **Résultat attendu :**

Après vérification du compte :
- ✅ **Compte admin vérifié** : `isVerified: true`
- ✅ **Connexion réussie** : Token JWT reçu
- ✅ **Accès aux endpoints protégés** : Avec le token
- ✅ **Tests Swagger fonctionnels** : Interface complètement utilisable

---

**Dernière mise à jour** : 14/08/2025  
**Statut** : ✅ Guide complet pour la vérification des comptes 