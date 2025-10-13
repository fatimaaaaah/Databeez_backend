#!/bin/bash

echo "🔐 Vérification de l'état de l'Admin - Databeez"
echo "================================================"

ADMIN_EMAIL="Diop.Abdou@example.com"

echo "📋 Informations de l'admin :"
echo "   Email: $ADMIN_EMAIL"
echo ""

echo "🔍 Étape 1: Vérifier l'état actuel de l'admin..."
echo "   Note: Utilisez PgAdmin pour exécuter cette requête"
echo ""

echo "📝 Requête SQL à exécuter dans PgAdmin :"
echo "   SELECT id, email, role, \"isVerified\", \"isActive\" FROM users WHERE email = '$ADMIN_EMAIL';"
echo ""

echo "🔑 Étape 2: Vérifier le compte admin (si non vérifié)"
echo "   Note: Exécutez cette requête pour vérifier le compte"
echo ""

echo "📋 Requête SQL pour vérifier le compte :"
echo "   UPDATE users SET \"isVerified\" = true WHERE email = '$ADMIN_EMAIL';"
echo ""

echo "🌐 Étape 3: Accéder à PgAdmin"
echo "   URL: http://localhost:5050"
echo "   Email: admin@databeez.com"
echo "   Mot de passe: admin123"
echo ""

echo "📊 Étape 4: Connexion à la base PostgreSQL"
echo "   Host: postgres (nom du container)"
echo "   Port: 5432"
echo "   Database: databeez"
echo "   Username: databeez"
echo "   Password: databeez123"
echo ""

echo "🧪 Étape 5: Test après vérification"
echo "   Note: Une fois le compte vérifié, testez la connexion"
echo ""

echo "📋 Commande de test de connexion :"
echo "   curl -X POST 'http://localhost:3000/api/v1/auth/login' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -d '{"
echo "       \"email\": \"$ADMIN_EMAIL\","
echo "       \"motDePasse\": \"MotDePasse123!\""
echo "     }'"
echo ""

echo "🎯 Résultat attendu après vérification :"
echo "   ✅ Token JWT reçu"
echo "   ✅ Accès aux endpoints protégés"
echo "   ✅ Tests Swagger fonctionnels"
echo ""

echo "🌐 Interface Swagger : http://localhost:3000/api"
echo "📚 Documentation : docs/systeme-verification-comptes.md" 