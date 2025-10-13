#!/bin/bash

echo "🔍 Test de cohérence des URLs Swagger vs API réelle"
echo "=================================================="

# Attendre que l'application soit prête
sleep 2

echo "✅ Test 1: Endpoint de santé"
echo "   URL réelle: http://localhost:3000/api/v1/health"
HEALTH_RESPONSE=$(curl -s http://localhost:3000/api/v1/health)
if [[ $HEALTH_RESPONSE == *"OK"* ]]; then
    echo "   ✅ Réponse: $HEALTH_RESPONSE"
else
    echo "   ❌ Échec: $HEALTH_RESPONSE"
    exit 1
fi

echo ""
echo "✅ Test 2: Création d'utilisateur"
echo "   URL réelle: http://localhost:3000/api/v1/users"
USER_DATA='{
    "numeroTelephone": "+2250701234569",
    "nom": "Test",
    "prenom": "URLs",
    "email": "test.urls@example.com",
    "motDePasse": "TestPassword123!",
    "role": "MENTEE"
}'

CREATE_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/users \
    -H "Content-Type: application/json" \
    -d "$USER_DATA")

if [[ $CREATE_RESPONSE == *"success"* ]]; then
    echo "   ✅ Utilisateur créé avec succès"
    USER_ID=$(echo $CREATE_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
    echo "   📝 ID: $USER_ID"
else
    echo "   ❌ Échec de création: $CREATE_RESPONSE"
    exit 1
fi

echo ""
echo "✅ Test 3: Endpoint d'authentification"
echo "   URL réelle: http://localhost:3000/api/v1/auth/login"
LOGIN_DATA='{
    "email": "test.urls@example.com",
    "motDePasse": "TestPassword123!"
}'

LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/login \
    -H "Content-Type: application/json" \
    -d "$LOGIN_DATA")

if [[ $LOGIN_RESPONSE == *"Unauthorized"* ]] || [[ $LOGIN_RESPONSE == *"Compte non vérifié"* ]]; then
    echo "   ⚠️  Réponse attendue (compte non vérifié): $LOGIN_RESPONSE"
else
    echo "   ❌ Réponse inattendue: $LOGIN_RESPONSE"
fi

echo ""
echo "🌐 Interface Swagger disponible sur : http://localhost:3000/api"
echo ""
echo "📋 URLs à vérifier dans Swagger :"
echo "   - Serveur sélectionné doit être : http://localhost:3000/api/v1"
echo "   - Endpoints doivent commencer par : /users, /auth, /health"
echo "   - URLs complètes doivent être : http://localhost:3000/api/v1/users, etc."
echo ""
echo "✅ Test de cohérence terminé !" 