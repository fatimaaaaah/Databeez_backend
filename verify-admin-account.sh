#!/bin/bash

echo "🔐 Vérification du compte Admin - Databeez"
echo "=========================================="

# Données de l'admin créé
ADMIN_EMAIL="Diop.Abdou@example.com"
ADMIN_PHONE="+221772980105"

echo "📋 Informations de l'admin :"
echo "   Email: $ADMIN_EMAIL"
echo "   Téléphone: $ADMIN_PHONE"
echo ""

echo "🔍 Étape 1: Rechercher l'ID de l'admin dans la base..."
echo "   Note: Vous devez exécuter cette requête SQL dans PgAdmin ou psql"
echo ""

echo "📝 Requête SQL à exécuter :"
echo "   SELECT id, email, role, \"isVerified\" FROM users WHERE email = '$ADMIN_EMAIL';"
echo ""

echo "🔑 Étape 2: Vérifier le compte via l'API"
echo "   Note: Remplacez {USER_ID} par l'ID trouvé ci-dessus"
echo ""

echo "📋 Commande curl pour vérifier le compte :"
echo "   curl -X PATCH 'http://localhost:3000/api/v1/users/{USER_ID}/verify' \\"
echo "     -H 'Content-Type: application/json' \\"
echo "     -H 'Authorization: Bearer {TOKEN_ADMIN_EXISTANT}'"
echo ""

echo "⚠️  IMPORTANT :"
echo "   - Vous avez besoin d'un token JWT d'un admin existant"
echo "   - Ou modifier directement la base de données"
echo ""

echo "💡 Solution rapide (modification directe en base) :"
echo "   UPDATE users SET \"isVerified\" = true WHERE email = '$ADMIN_EMAIL';"
echo ""

echo "🌐 Interface Swagger : http://localhost:3000/api"
echo "📚 Documentation : docs/guide-urls-swagger.md" 