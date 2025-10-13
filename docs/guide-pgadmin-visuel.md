# 🖥️ Guide Visuel PgAdmin - Résolution des Erreurs "Unauthorized"

## 🎯 **Objectif : Vérifier le compte admin pour résoudre les erreurs Unauthorized**

### **Problème actuel :**
- ❌ Tous les endpoints protégés affichent "Unauthorized"
- ❌ Impossible de se connecter avec votre admin
- ❌ Pas de token JWT pour autoriser Swagger

### **Solution :**
Vérifier le compte admin via PgAdmin pour activer l'authentification.

---

## 🚀 **ÉTAPE 1 : Accéder à PgAdmin**

### **1. Ouvrir le navigateur**
- **URL** : http://localhost:5050
- **Attendre** que la page se charge

### **2. Page de connexion PgAdmin**
```
┌─────────────────────────────────────┐
│           PgAdmin 4                 │
├─────────────────────────────────────┤
│ Email: admin@databeez.com          │
│ Password: admin123                  │
│                                     │
│           [Login]                   │
└─────────────────────────────────────┘
```

---

## 🔗 **ÉTAPE 2 : Se connecter à la base de données**

### **1. Clic droit sur "Servers"**
- **Localisation** : Panneau gauche de PgAdmin
- **Action** : Clic droit → "Create" → "Server..."

### **2. Onglet "General"**
```
┌─────────────────────────────────────┐
│ General                             │
├─────────────────────────────────────┤
│ Name: Databeez                      │
│ Comment: Base de données Databeez   │
└─────────────────────────────────────┘
```

### **3. Onglet "Connection"**
```
┌─────────────────────────────────────┐
│ Connection                          │
├─────────────────────────────────────┤
│ Host name/address: postgres         │
│ Port: 5432                          │
│ Maintenance database: databeez      │
│ Username: databeez                  │
│ Password: databeez123               │
│                                     │
│           [Save]                    │
└─────────────────────────────────────┘
```

---

## 🔍 **ÉTAPE 3 : Vérifier l'état de l'admin**

### **1. Naviguer dans l'arborescence**
```
Servers
└── Databeez
    └── Databases
        └── databeez
            └── Schemas
                └── public
                    └── Tables
                        └── users
```

### **2. Clic droit sur "users" → "View/Edit Data" → "All Rows"**

### **3. Rechercher votre admin**
- **Filtrer** par email : `Diop.Abdou@example.com`
- **Vérifier** la colonne `isVerified`

### **4. État actuel attendu :**
```
┌─────────────────────────────────────────────────────────┐
│ users table                                             │
├─────────────────────────────────────────────────────────┤
│ id    | email                    | isVerified | role   │
├─────────────────────────────────────────────────────────┤
│ cmeb..| Diop.Abdou@example.com  | false      | ADMIN  │
└─────────────────────────────────────────────────────────┘
```

---

## ✅ **ÉTAPE 4 : Vérifier le compte admin**

### **1. Ouvrir l'éditeur SQL**
- **Clic droit** sur "Databeez" (base)
- **"Query Tool"**

### **2. Exécuter la requête de vérification**
```sql
-- Vérifier l'état actuel
SELECT id, email, role, "isVerified", "isActive" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';

-- Vérifier le compte
UPDATE users 
SET "isVerified" = true 
WHERE email = 'Diop.Abdou@example.com';

-- Vérifier le changement
SELECT "isVerified" 
FROM users 
WHERE email = 'Diop.Abdou@example.com';
```

### **3. Résultat attendu :**
```
┌─────────────────────────────────────────────────────────┐
│ Query result                                            │
├─────────────────────────────────────────────────────────┤
│ isVerified                                              │
├─────────────────────────────────────────────────────────┤
│ true                                                    │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 **ÉTAPE 5 : Tester la connexion**

### **1. Retourner à Swagger**
- **URL** : http://localhost:3000/api
- **Endpoint** : `POST /auth/login`

### **2. Tester la connexion**
```json
{
  "email": "Diop.Abdou@example.com",
  "motDePasse": "MotDePasse123!"
}
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

---

## 🔑 **ÉTAPE 6 : Autoriser Swagger**

### **1. Copier le token**
- **Sélectionner** le `accessToken` de la réponse
- **Exemple** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **2. Cliquer sur "Authorize"**
- **Localisation** : Bouton vert avec cadenas en haut à droite
- **Format** : `Bearer {votre_token}`
- **Exemple** : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### **3. Vérifier l'autorisation**
- **Indicateur** : Cadenas fermé sur les endpoints protégés
- **Test** : Essayer un endpoint protégé

---

## 🎉 **RÉSULTAT FINAL**

### **Avant la vérification :**
- ❌ Tous les endpoints protégés : "Unauthorized"
- ❌ Impossible de se connecter
- ❌ Swagger inutilisable pour les tests

### **Après la vérification :**
- ✅ **Connexion réussie** avec votre admin
- ✅ **Token JWT** reçu et configuré
- ✅ **Tous les endpoints** accessibles
- ✅ **Swagger 100% fonctionnel**
- ✅ **Plus d'erreurs** "Unauthorized"

---

## 🚨 **PROBLÈMES COURANTS**

### **❌ "Connection refused" sur PgAdmin**
- **Cause** : Container Docker arrêté
- **Solution** : `docker-compose up -d`

### **❌ "Authentication failed" sur PgAdmin**
- **Cause** : Mauvais identifiants
- **Solution** : Vérifier `admin@databeez.com` / `admin123`

### **❌ "Database does not exist"**
- **Cause** : Base non initialisée
- **Solution** : `npm run db:push`

### **❌ "Table users does not exist"**
- **Cause** : Schéma non créé
- **Solution** : `npm run db:generate && npm run db:push`

---

**Dernière mise à jour** : 14/08/2025  
**Statut** : ✅ Guide visuel complet pour PgAdmin 