#!/bin/bash

# Script de test pour l'API Databeez
echo "🐝 Test de l'API Databeez"
echo "=========================="

BASE_URL="http://localhost:3000/api/v1"

# Test de l'endpoint de santé
echo "1. Test de l'endpoint de santé..."
HEALTH_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/health")
HTTP_CODE="${HEALTH_RESPONSE: -3}"
RESPONSE_BODY="${HEALTH_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Endpoint de santé : OK (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
else
    echo "❌ Endpoint de santé : ERREUR (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
fi

echo ""

# Test de l'endpoint racine
echo "2. Test de l'endpoint racine..."
ROOT_RESPONSE=$(curl -s -w "%{http_code}" "$BASE_URL/")
HTTP_CODE="${ROOT_RESPONSE: -3}"
RESPONSE_BODY="${ROOT_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Endpoint racine : OK (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
else
    echo "❌ Endpoint racine : ERREUR (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
fi

echo ""

# Test de l'interface Swagger
echo "3. Test de l'interface Swagger..."
SWAGGER_RESPONSE=$(curl -s -w "%{http_code}" "http://localhost:3000/api")
HTTP_CODE="${SWAGGER_RESPONSE: -3}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Interface Swagger : OK (HTTP $HTTP_CODE)"
    echo "   URL : http://localhost:3000/api"
else
    echo "❌ Interface Swagger : ERREUR (HTTP $HTTP_CODE)"
fi

echo ""

# Test de création d'un utilisateur (sans authentification)
echo "4. Test de création d'utilisateur..."
USER_DATA='{
  "numeroTelephone": "+2250701234567",
  "nom": "Test",
  "prenom": "User",
  "email": "test.user@example.com",
  "motDePasse": "TestPassword123!",
  "role": "MENTEE"
}'

CREATE_RESPONSE=$(curl -s -w "%{http_code}" \
  -X POST "$BASE_URL/users" \
  -H "Content-Type: application/json" \
  -d "$USER_DATA")

HTTP_CODE="${CREATE_RESPONSE: -3}"
RESPONSE_BODY="${CREATE_RESPONSE%???}"

if [ "$HTTP_CODE" = "201" ]; then
    echo "✅ Création d'utilisateur : OK (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
else
    echo "❌ Création d'utilisateur : ERREUR (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
fi

echo ""

# Test de connexion
echo "5. Test de connexion..."
LOGIN_DATA='{
  "identifier": "test.user@example.com",
  "password": "TestPassword123!"
}'

LOGIN_RESPONSE=$(curl -s -w "%{http_code}" \
  -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "$LOGIN_DATA")

HTTP_CODE="${LOGIN_RESPONSE: -3}"
RESPONSE_BODY="${LOGIN_RESPONSE%???}"

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Connexion : OK (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
    
    # Extraire le token JWT pour les tests suivants
    TOKEN=$(echo "$RESPONSE_BODY" | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
    if [ ! -z "$TOKEN" ]; then
        echo "   Token JWT extrait : ${TOKEN:0:20}..."
        
        # Test de récupération du profil utilisateur
        echo ""
        echo "6. Test de récupération du profil (avec authentification)..."
        PROFILE_RESPONSE=$(curl -s -w "%{http_code}" \
          -X GET "$BASE_URL/users/me" \
          -H "Authorization: Bearer $TOKEN")
        
        HTTP_CODE="${PROFILE_RESPONSE: -3}"
        RESPONSE_BODY="${PROFILE_RESPONSE%???}"
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Récupération du profil : OK (HTTP $HTTP_CODE)"
            echo "   Réponse : $RESPONSE_BODY"
        else
            echo "❌ Récupération du profil : ERREUR (HTTP $HTTP_CODE)"
            echo "   Réponse : $RESPONSE_BODY"
        fi
    else
        echo "   ⚠️  Impossible d'extraire le token JWT"
    fi
else
    echo "❌ Connexion : ERREUR (HTTP $HTTP_CODE)"
    echo "   Réponse : $RESPONSE_BODY"
fi

echo ""
echo "🎯 Résumé des tests :"
echo "====================="
echo "Interface Swagger : http://localhost:3000/api"
echo "API Base URL : $BASE_URL"
echo ""
echo "📚 Documentation complète disponible dans : docs/swagger-guide.md" 