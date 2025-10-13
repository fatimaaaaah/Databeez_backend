#!/bin/bash

echo "🔐 Vérification automatique du compte Admin"
echo "==========================================="

# Données de l'admin
ADMIN_EMAIL="Diop.Abdou@example.com"

echo "🔍 Recherche de l'admin dans la base..."

# Utiliser Prisma pour trouver l'admin
ADMIN_QUERY=$(npx prisma db execute --stdin <<< "
SELECT id, email, role, \"isVerified\" 
FROM users 
WHERE email = '$ADMIN_EMAIL';
" 2>/dev/null)

if [[ $? -eq 0 ]]; then
    echo "✅ Admin trouvé dans la base"
    echo "📋 Informations : $ADMIN_QUERY"
else
    echo "❌ Impossible d'exécuter la requête Prisma"
    echo "💡 Utilisez PgAdmin à la place :"
    echo "   URL: http://localhost:5050"
    echo "   Requête: UPDATE users SET \"isVerified\" = true WHERE email = '$ADMIN_EMAIL';"
fi

echo ""
echo "🔄 Alternative : Redémarrer avec un admin pré-vérifié"
echo "   Le script de seed crée automatiquement un admin vérifié"
echo ""

echo "📋 Commandes pour re-seeder la base :"
echo "   npm run db:seed"
echo ""

echo "🌐 Interface Swagger : http://localhost:3000/api"
echo "📚 Documentation : docs/guide-urls-swagger.md" 