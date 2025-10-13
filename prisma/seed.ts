import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Créer un utilisateur admin
  const adminPassword = await bcrypt.hash('Admin123!', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@databeez.africa' },
    update: {},
    create: {
      email: 'admin@databeez.africa',
      numeroTelephone: '+225070000000',
      nom: 'Admin',
      prenom: 'Databeez',
      motDePasse: adminPassword,
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
  });

  // Créer un mentor exemple
  const mentorPassword = await bcrypt.hash('Mentor123!', 12);
  const mentor = await prisma.user.upsert({
    where: { email: 'mentor@databeez.africa' },
    update: {},
    create: {
      email: 'mentor@databeez.africa',
      numeroTelephone: '+225070000001',
      nom: 'Kouassi',
      prenom: 'Expert',
      motDePasse: mentorPassword,
      role: 'MENTOR',
      isVerified: true,
      isActive: true,
    },
  });

  // Créer le profil mentor
  await prisma.mentor.upsert({
    where: { userId: mentor.id },
    update: {},
    create: {
      userId: mentor.id,
      domaineExpertise: 'Développement Web',
      anneesExperience: 8,
      biographie: 'Expert en développement web avec 8 ans d\'expérience',
      noteMoyenne: 4.8,
      tarifParSession: 50.0,
      disponibilites: {
        lundi: ['09:00-12:00', '14:00-17:00'],
        mardi: ['09:00-12:00', '14:00-17:00'],
        mercredi: ['09:00-12:00'],
        jeudi: ['14:00-17:00'],
        vendredi: ['09:00-12:00'],
      },
      isDisponible: true,
    },
  });

  // Créer un mentee exemple
  const menteePassword = await bcrypt.hash('Mentee123!', 12);
  const mentee = await prisma.user.upsert({
    where: { email: 'mentee@databeez.africa' },
    update: {},
    create: {
      email: 'mentee@databeez.africa',
      numeroTelephone: '+225070000002',
      nom: 'Khar',
      prenom: 'Junior',
      motDePasse: menteePassword,
      role: 'MENTEE',
      isVerified: true,
      isActive: true,
    },
  });

  // Créer le profil mentee
  const menteeProfile = await prisma.mentee.upsert({
    where: { userId: mentee.id },
    update: {},
    create: {
      userId: mentee.id,
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
  });

  console.log('✅ Profil mentee créé:', menteeProfile.id);

  // Créer des compétences
  const competences = [
    { nom: 'HTML', description: 'Langage de balisage pour le web', niveau: 'DEBUTANT' as const, categorie: 'Frontend' },
    { nom: 'CSS', description: 'Langage de style pour le web', niveau: 'DEBUTANT' as const, categorie: 'Frontend' },
    { nom: 'JavaScript', description: 'Langage de programmation web', niveau: 'DEBUTANT' as const, categorie: 'Frontend' },
    { nom: 'React', description: 'Bibliothèque JavaScript pour interfaces', niveau: 'INTERMEDIAIRE' as const, categorie: 'Frontend' },
    { nom: 'Node.js', description: 'Runtime JavaScript côté serveur', niveau: 'INTERMEDIAIRE' as const, categorie: 'Backend' },
    { nom: 'TypeScript', description: 'Superset typé de JavaScript', niveau: 'INTERMEDIAIRE' as const, categorie: 'Langage' },
    { nom: 'PostgreSQL', description: 'Base de données relationnelle', niveau: 'INTERMEDIAIRE' as const, categorie: 'Base de données' },
    { nom: 'Docker', description: 'Conteneurisation d\'applications', niveau: 'AVANCE' as const, categorie: 'DevOps' },
  ];

  for (const competence of competences) {
    await prisma.competence.upsert({
      where: { nom: competence.nom },
      update: {},
      create: competence,
    });
  }

  // Créer un compte crédit pour le mentee
  await prisma.credit.upsert({
    where: { menteeId: menteeProfile.id },
    update: {},
    create: {
      menteeId: menteeProfile.id,
      solde: 100.0,
      dateDerniereRecharge: new Date(),
    },
  });

  console.log('✅ Seeding terminé avec succès!');
  console.log(`👑 Admin créé: ${admin.email}`);
  console.log(`🎓 Mentor créé: ${mentor.email}`);
  console.log(`📚 Mentee créé: ${mentee.email}`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 