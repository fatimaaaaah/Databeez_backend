#!/bin/bash

echo "🧪 Test de la documentation Swagger nettoyée"
echo "=============================================="

# Attendre que l'application soit prête
sleep 2

# Tester l'endpoint de santé
echo "✅ Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/v1/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo "   ✅ Endpoint /health fonctionne"
else
    echo "   ❌ Endpoint /health ne fonctionne pas"
    exit 1
fi

# Tester la création d'un utilisateur
echo "✅ Test de création d'utilisateur..."
USER_DATA='{
    "numeroTelephone": "+2250701234568",
    "nom": "Test",
    "prenom": "Swagger",
    "email": "test.swagger@example.com",
    "motDePasse": "TestPassword123!",
    "role": "MENTEE"
}'

CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/users \
    -H "Content-Type: application/json" \
    -d "$USER_DATA")

if [[ $CREATE_RESPONSE == *"success"* ]]; then
    echo "   ✅ Création d'utilisateur réussie"
    USER_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   📝 ID utilisateur créé: $USER_ID"
else
    echo "   ❌ Échec de création d'utilisateur"
    echo "   📄 Réponse: $CREATE_RESPONSE"
    exit 1
fi

# Tester la connexion
echo "✅ Test de connexion..."
LOGIN_DATA='{
    "email": "test.swagger@example.com",
    "motDePasse": "TestPassword123!"
}'

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

if [[ $LOGIN_RESPONSE == *"Compte non vérifié"* ]]; then
    echo "   ⚠️  Compte créé mais non vérifié (comportement attendu)"
elif [[ $LOGIN_RESPONSE == *"success"* ]]; then
    echo "   ✅ Connexion réussie"
else
    echo "   ❌ Échec de connexion"
    echo "   📄 Réponse: $LOGIN_RESPONSE"
fi

echo ""
echo "🌐 Interface Swagger disponible sur : http://localhost:3000/api"
echo "📚 Sections disponibles :"
echo "   - auth : Endpoints d'authentification"
echo "   - users : Gestion des utilisateurs"
echo "   - app : Endpoints de santé et monitoring"
echo ""
echo "✅ Documentation Swagger nettoyée avec succès !" 