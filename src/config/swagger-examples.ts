// Exemples de données pour la documentation Swagger

export const SWAGGER_EXAMPLES = {
  // Exemples d'utilisateurs
  USER_EXAMPLES: {
    MENTEE: {
      summary: 'Exemple de profil Mentee',
      value: {
        id: 'clx1234567890abcdef',
        numeroTelephone: '+2250701234567',
        nom: 'Kouassi',
        prenom: 'Khar',
        email: 'khar.kouassi@example.com',
        role: 'MENTEE',
        photoProfil: 'https://example.com/photos/khar.jpg',
        dateInscription: '2024-08-14T10:00:00.000Z',
        isVerified: true,
        isActive: true,
        profil: {
          id: 'clx1234567890abcdef',
          userId: 'clx1234567890abcdef',
          objectifs: ['Maîtriser React', 'Apprendre Node.js', 'Développer des APIs'],
          competencesActuelles: {
            html: 'INTERMEDIAIRE',
            css: 'INTERMEDIAIRE',
            javascript: 'DEBUTANT',
          },
          competencesCible: {
            react: 'AVANCE',
            nodejs: 'INTERMEDIAIRE',
            typescript: 'INTERMEDIAIRE',
          },
          progression: 25.0,
        },
      },
    },
    MENTOR: {
      summary: 'Exemple de profil Mentor',
      value: {
        id: 'clx1234567890abcdef',
        numeroTelephone: '+2250701234568',
        nom: 'Traoré',
        prenom: 'Fatou',
        email: 'fatou.traore@example.com',
        role: 'MENTOR',
        photoProfil: 'https://example.com/photos/fatou.jpg',
        dateInscription: '2024-08-14T10:00:00.000Z',
        isVerified: true,
        isActive: true,
        profil: {
          id: 'clx1234567890abcdef',
          userId: 'clx1234567890abcdef',
          domaineExpertise: 'Développement Web Full-Stack',
          anneesExperience: 8,
          biographie: 'Développeuse web expérimentée spécialisée dans React, Node.js et les architectures cloud.',
          noteMoyenne: 4.8,
          tarifParSession: 50.0,
          disponibilites: ['Lundi 18h-20h', 'Mercredi 18h-20h', 'Samedi 10h-12h'],
        },
      },
    },
    ADMIN: {
      summary: 'Exemple de profil Admin',
      value: {
        id: 'clx1234567890abcdef',
        numeroTelephone: '+2250701234569',
        nom: 'Admin',
        prenom: 'Databeez',
        email: 'admin@databeez.africa',
        role: 'ADMIN',
        photoProfil: 'https://example.com/photos/admin.jpg',
        dateInscription: '2024-08-14T10:00:00.000Z',
        isVerified: true,
        isActive: true,
      },
    },
  },

  // Exemples de sessions
  SESSION_EXAMPLES: {
    CREATED: {
      summary: 'Session créée avec succès',
      value: {
        id: 'clx1234567890abcdef',
        mentorId: 'clx1234567890abcdef',
        menteeId: 'clx1234567890abcdef',
        dateHeure: '2024-08-20T14:00:00.000Z',
        duree: 60,
        typeSession: 'VIDEO',
        statut: 'PLANIFIEE',
        objectifs: ['Révision des concepts React', 'Débuggage d\'une application'],
        notes: 'Préparer les questions et le code à déboguer',
        createdAt: '2024-08-14T10:00:00.000Z',
        updatedAt: '2024-08-14T10:00:00.000Z',
      },
    },
    UPDATED: {
      summary: 'Session mise à jour',
      value: {
        id: 'clx1234567890abcdef',
        statut: 'TERMINEE',
        compteRendu: 'Session très productive. Le mentee a bien compris les concepts React et nous avons résolu plusieurs bugs.',
        evaluation: {
          note: 5,
          commentaire: 'Excellent mentor, très pédagogue et patient.',
        },
      },
    },
  },

  // Exemples de paiements
  PAYMENT_EXAMPLES: {
    ORANGE_MONEY: {
      summary: 'Paiement Orange Money',
      value: {
        id: 'clx1234567890abcdef',
        menteeId: 'clx1234567890abcdef',
        montant: 100.0,
        moyenPaiement: 'ORANGE_MONEY',
        numeroTelephone: '+2250701234567',
        statut: 'EN_COURS',
        reference: 'OM_20240814_001',
        datePaiement: '2024-08-14T10:00:00.000Z',
        createdAt: '2024-08-14T10:00:00.000Z',
      },
    },
    CREDIT: {
      summary: 'Achat de crédits',
      value: {
        id: 'clx1234567890abcdef',
        menteeId: 'clx1234567890abcdef',
        montant: 50.0,
        moyenPaiement: 'CREDIT',
        statut: 'COMPLETE',
        reference: 'CR_20240814_001',
        datePaiement: '2024-08-14T10:00:00.000Z',
        createdAt: '2024-08-14T10:00:00.000Z',
      },
    },
  },

  // Exemples de notifications
  NOTIFICATION_EXAMPLES: {
    SESSION_REMINDER: {
      summary: 'Rappel de session',
      value: {
        id: 'clx1234567890abcdef',
        utilisateurId: 'clx1234567890abcdef',
        type: 'SESSION_REMINDER',
        titre: 'Rappel de session',
        message: 'Votre session de mentorat commence dans 30 minutes.',
        statut: 'NON_LU',
        dateEnvoi: '2024-08-14T13:30:00.000Z',
        createdAt: '2024-08-14T13:30:00.000Z',
      },
    },
    PAYMENT_SUCCESS: {
      summary: 'Confirmation de paiement',
      value: {
        id: 'clx1234567890abcdef',
        utilisateurId: 'clx1234567890abcdef',
        type: 'PAYMENT_SUCCESS',
        titre: 'Paiement confirmé',
        message: 'Votre paiement de 100.0 FCFA a été confirmé. Vos crédits ont été ajoutés à votre compte.',
        statut: 'NON_LU',
        dateEnvoi: '2024-08-14T10:00:00.000Z',
        createdAt: '2024-08-14T10:00:00.000Z',
      },
    },
  },

  // Exemples de matching
  MATCHING_EXAMPLES: {
    RECOMMENDATION: {
      summary: 'Recommandation de mentor',
      value: {
        id: 'clx1234567890abcdef',
        menteeId: 'clx1234567890abcdef',
        mentorId: 'clx1234567890abcdef',
        scoreCompatibilite: 0.85,
        statut: 'EN_ATTENTE',
        dateCreation: '2024-08-14T10:00:00.000Z',
        mentor: {
          nom: 'Traoré',
          prenom: 'Fatou',
          domaineExpertise: 'Développement Web Full-Stack',
          noteMoyenne: 4.8,
          tarifParSession: 50.0,
        },
      },
    },
    MUTUAL_LIKE: {
      summary: 'Match mutuel',
      value: {
        id: 'clx1234567890abcdef',
        menteeId: 'clx1234567890abcdef',
        mentorId: 'clx1234567890abcdef',
        scoreCompatibilite: 0.92,
        statut: 'MATCH_MUTUEL',
        dateCreation: '2024-08-14T10:00:00.000Z',
        dateMatch: '2024-08-14T11:00:00.000Z',
      },
    },
  },

  // Exemples d'erreurs
  ERROR_EXAMPLES: {
    VALIDATION_ERROR: {
      summary: 'Erreur de validation',
      value: {
        statusCode: 400,
        message: ['Le numéro de téléphone doit être valide', 'L\'email doit être valide'],
        error: 'Bad Request',
      },
    },
    UNAUTHORIZED: {
      summary: 'Non autorisé',
      value: {
        statusCode: 401,
        message: 'Token JWT invalide ou expiré',
        error: 'Unauthorized',
      },
    },
    FORBIDDEN: {
      summary: 'Accès interdit',
      value: {
        statusCode: 403,
        message: 'Vous n\'avez pas les permissions nécessaires pour cette action',
        error: 'Forbidden',
      },
    },
    NOT_FOUND: {
      summary: 'Ressource non trouvée',
      value: {
        statusCode: 404,
        message: 'Utilisateur non trouvé',
        error: 'Not Found',
      },
    },
    INTERNAL_ERROR: {
      summary: 'Erreur serveur interne',
      value: {
        statusCode: 500,
        message: 'Une erreur interne s\'est produite',
        error: 'Internal Server Error',
      },
    },
  },
}; 