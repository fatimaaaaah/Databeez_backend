import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const admin = await prisma.utilisateur.upsert({
    where: { email: 'admin@databeez.com' },
    update: {},
    create: {
      email: 'admin@databeez.com',
      motDePasse: 'hashedpassword',
      role: 'ADMIN',
    },
  })

  const mentorUser = await prisma.utilisateur.upsert({
    where: { email: 'mentor@databeez.com' },
    update: {},
    create: {
      email: 'mentor@databeez.com',
      motDePasse: 'hashedpassword',
      role: 'MENTOR',
    },
  })

  const mentor = await prisma.mentor.upsert({
    where: { utilisateurId: mentorUser.id },
    update: {},
    create: {
      utilisateurId: mentorUser.id,
      domaineExpertise: 'Développement Web',
      anneesExperience: 5,
      biographie: 'Passionné par la tech et la transmission du savoir.',
      disponibilites: JSON.stringify({
        lundi: ['9h-12h', '14h-18h'],
        mardi: ['10h-16h'],
      }),
    },
  })

  const menteeUser = await prisma.utilisateur.upsert({
    where: { email: 'mentee@databeez.com' },
    update: {},
    create: {
      email: 'mentee@databeez.com',
      motDePasse: 'hashedpassword',
      role: 'MENTEE',
    },
  })

  const mentee = await prisma.mentee.upsert({
    where: { utilisateurId: menteeUser.id },
    update: {},
    create: {
      utilisateurId: menteeUser.id,
      nom: 'Diouf',
      prenom: 'Fatima',
      type: 'Étudiant',
      biographie: 'Apprenante motivée à évoluer dans la tech !',
    },
  })

  console.log({ admin, mentor, mentee })
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
