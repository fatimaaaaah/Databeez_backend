import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';

export function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Databeez API')
    .setDescription(`
      # 🐝 API Databeez - Plateforme de Mentorat Professionnel

      ## Description
      API backend pour la plateforme Databeez, une solution de mentorat professionnel 
      destinée aux jeunes professionnels et étudiants d'Afrique francophone.

      ## Fonctionnalités Principales
      - 👥 **Gestion des Utilisateurs** : Inscription, authentification, profils mentor/mentee
      - 🔐 **Authentification Sécurisée** : JWT, refresh tokens, gestion des rôles
      - 📊 **Gestion des Profils** : Création et modification des profils utilisateurs
      - 🏥 **Monitoring de Santé** : Vérification de l'état de l'API

      ## Authentification
      L'API utilise JWT (JSON Web Tokens) pour l'authentification.
      - Incluez le token dans l'en-tête : \`Authorization: Bearer <token>\`
      - Les endpoints publics sont marqués avec \`@Public()\`
      - Les autres endpoints nécessitent une authentification valide

      ## Rôles Utilisateur
      - **ADMIN** : Accès complet à la gestion des utilisateurs
      - **MENTOR** : Profil expert avec compétences et disponibilités
      - **MENTEE** : Profil apprenant avec objectifs et progression

      ## Codes de Statut
      - \`200\` : Succès
      - \`201\` : Créé avec succès
      - \`400\` : Requête invalide
      - \`401\` : Non authentifié
      - \`403\` : Accès refusé
      - \`404\` : Ressource non trouvée
      - \`500\` : Erreur serveur interne

      ## Support
      Pour toute question ou support technique, contactez l'équipe Databeez.
    `)
    .setVersion('1.0.0')
    .setContact('Databeez Team', 'https://databeez.africa', 'support@databeez.africa')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('auth', 'Endpoints d\'authentification et gestion des tokens')
    .addTag('users', 'Gestion des utilisateurs, profils et comptes')
    .addTag('app', 'Endpoints de santé et monitoring de l\'API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addServer('http://localhost:3000/api/v1', 'Serveur de développement local (avec préfixe /api/v1)')
    .addServer('https://api.databeez.africa/api/v1', 'Serveur de production (avec préfixe /api/v1)')
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [],
    deepScanRoutes: true,
  });

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showRequestHeaders: true,
      docExpansion: 'list',
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      tryItOutEnabled: true,
      requestInterceptor: (req: any) => {
        // Ajouter des en-têtes par défaut pour les tests
        req.headers['Content-Type'] = 'application/json';
        return req;
      },
      // Améliorer la reconnaissance de l'autorisation
      onComplete: () => {
        console.log('✅ Swagger UI chargé avec succès');
      },
      // Forcer la reconnaissance des sécurités
      securityDefinitions: {
        'JWT-auth': {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
      }
    },
    customSiteTitle: 'Databeez API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #2c3e50; font-size: 36px; }
      .swagger-ui .info .description { font-size: 16px; line-height: 1.6; }
      .swagger-ui .scheme-container { background: #f8f9fa; padding: 20px; border-radius: 8px; }
      .swagger-ui .auth-wrapper { background: #e8f5e8; padding: 15px; border-radius: 6px; }
    `,
    customJs: [
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-bundle.js',
      'https://cdn.jsdelivr.net/npm/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js',
    ],
  });

  return document;
} 