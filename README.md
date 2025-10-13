# 🐝 Databeez Backend

Backend de la plateforme de mentorat professionnel Databeez, conçue pour accompagner la montée en compétences des jeunes professionnels en Afrique francophone.

## 🎯 Objectif du Projet

Databeez est une plateforme qui met en relation des jeunes professionnels/étudiants (mentees) avec des mentors experts. L'objectif est d'accompagner la montée en compétences de cette génération en transition vers la vie active, particulièrement en Afrique francophone.

## 🏗️ Architecture Technique

### Stack Backend
- **Framework** : NestJS avec TypeScript
- **Base de données** : PostgreSQL avec Prisma ORM
- **Cache** : Redis
- **Authentification** : Passport.js + JWT
- **Documentation** : Swagger automatique
- **Validation** : class-validator + class-transformer
- **Tests** : Jest + supertest
- **WebSocket** : @nestjs/websockets pour sessions temps réel

### Modules Principaux
- **User Module** : Gestion utilisateurs, profils, authentification
- **Matching Module** : Algorithme de mise en relation mentor/mentee
- **Session Module** : Planification, gestion des sessions de mentoring
- **Payment Module** : Gestion crédits, transactions (Orange Money, etc.)
- **Notification Module** : Push notifications, rappels, alertes
- **Analytics Module** : Métriques, KPIs, dashboard admin

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (v18+)
- PostgreSQL
- Redis
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/AbdouazizDEV/Databeez-Back.git
cd Databeez-Back
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configuration de l'environnement**
```bash
cp env.example .env
# Éditer le fichier .env avec vos configurations
```

4. **Configuration de la base de données**
```bash
# Générer le client Prisma
npm run db:generate

# Pousser le schéma vers la base de données
npm run db:push

# Ou créer une migration
npm run db:migrate
```

5. **Démarrer l'application**
```bash
# Mode développement
npm run start:dev

# Mode production
npm run build
npm run start:prod
```

## 📚 Documentation API

Une fois l'application démarrée, la documentation Swagger est disponible sur :
```
http://localhost:3000/api
```

## 🗄️ Structure de la Base de Données

### Tables Principales
- **Utilisateur** : Profils de base (mentors, mentees, admins)
- **Mentor** : Experts avec domaines d'expertise et disponibilités
- **Mentee** : Jeunes professionnels avec objectifs et progression
- **SessionMentorat** : Sessions planifiées et réalisées
- **Evaluation** : Notes et commentaires sur les sessions
- **Paiement** : Transactions et gestion des crédits
- **Credit** : Solde des comptes mentees
- **Matching** : Algorithmes de compatibilité mentor/mentee
- **Competence** : Référentiel des compétences
- **Notification** : Système de notifications

## 🔐 Authentification

L'API utilise un système d'authentification JWT avec :
- **Access Token** : Valide 7 jours
- **Refresh Token** : Valide 30 jours
- **Rôles** : USER, MENTOR, MENTEE, ADMIN
- **Guards** : JWT, Local, Roles

## 💳 Système de Paiement

Intégration avec :
- Orange Money
- Moov Money
- MTN Mobile Money
- Cartes bancaires
- Virements

## 📱 Fonctionnalités Principales

### Pour les Mentees
- Création de profil avec objectifs
- Recherche de mentors par domaine
- Planification de sessions
- Suivi de progression
- Gestion des crédits

### Pour les Mentors
- Création de profil expert
- Gestion des disponibilités
- Sessions de mentorat
- Évaluations et feedback

### Pour les Admins
- Gestion des utilisateurs
- Modération des contenus
- Analytics et métriques
- Support utilisateur

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests avec couverture
npm run test:cov

# Tests en mode watch
npm run test:watch
```

## 🐳 Docker

```bash
# Construire l'image
docker build -t databeez-backend .

# Démarrer avec docker-compose
docker-compose up -d
```

## 📁 Structure du Projet

```
src/
├── common/           # DTOs, guards, interceptors communs
├── config/           # Configuration base de données, Redis
├── modules/          # Modules métier
│   ├── user/         # Gestion utilisateurs
│   ├── auth/         # Authentification
│   ├── matching/     # Algorithme de matching
│   ├── session/      # Sessions de mentorat
│   ├── payment/      # Gestion paiements
│   ├── notification/ # Notifications
│   └── analytics/    # Métriques et analyses
└── main.ts           # Point d'entrée

prisma/
├── schema.prisma     # Schéma de base de données
└── migrations/       # Migrations

docs/                 # Documentation
├── api/             # Spécifications API
├── architecture/    # Diagrammes d'architecture
└── deployment/      # Guides de déploiement
```

## 🌍 Spécificités Afrique Francophone

- **Paiements mobiles** : Intégration Orange Money, Moov Money
- **Connexions limitées** : Interface mobile-first, cache Redis
- **Langues** : Support français et langues locales
- **Devises** : FCFA, EUR, USD
- **Fuseaux horaires** : UTC+0, UTC+1, UTC+2

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 📞 Support

- **Email** : support@databeez.africa
- **Issues** : [GitHub Issues](https://github.com/AbdouazizDEV/Databeez-Back/issues)
- **Documentation** : [Wiki du projet](https://github.com/AbdouazizDEV/Databeez-Back/wiki)

## 🙏 Remerciements

- Équipe NestJS pour l'excellent framework
- Communauté Prisma pour l'ORM moderne
- Tous les contributeurs du projet

---

**Développé avec ❤️ pour l'Afrique francophone** 