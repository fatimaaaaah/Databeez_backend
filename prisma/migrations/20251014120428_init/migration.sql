-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'MENTOR', 'MENTEE', 'ADMIN');

-- CreateEnum
CREATE TYPE "SessionStatut" AS ENUM ('PLANIFIEE', 'EN_COURS', 'TERMINEE', 'ANNULEE', 'REPORTEE');

-- CreateEnum
CREATE TYPE "TypeSession" AS ENUM ('VIDEO', 'AUDIO', 'CHAT', 'PRESENTIEL');

-- CreateEnum
CREATE TYPE "MoyenPaiement" AS ENUM ('ORANGE_MONEY', 'MOOV_MONEY', 'MTN_MOBILE_MONEY', 'CARTE_BANCAIRE', 'VIREMENT');

-- CreateEnum
CREATE TYPE "StatutPaiement" AS ENUM ('EN_ATTENTE', 'VALIDE', 'ECHEC', 'REMBOURSE');

-- CreateEnum
CREATE TYPE "StatutMatching" AS ENUM ('EN_ATTENTE', 'ACCEPTE', 'REFUSE', 'EXPIRED');

-- CreateEnum
CREATE TYPE "NiveauCompetence" AS ENUM ('DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('SESSION', 'MATCHING', 'PAIEMENT', 'SYSTEME', 'REMINDER');

-- CreateEnum
CREATE TYPE "StatutNotification" AS ENUM ('NON_LU', 'LU', 'ARCHIVE');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "numeroTelephone" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "photoProfil" TEXT,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "domaineExpertise" TEXT NOT NULL,
    "anneesExperience" INTEGER NOT NULL,
    "biographie" TEXT,
    "noteMoyenne" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "tarifParSession" DOUBLE PRECISION NOT NULL,
    "disponibilites" JSONB NOT NULL,
    "isDisponible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mentees" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "objectifs" TEXT[],
    "competencesActuelles" JSONB,
    "competencesCible" JSONB,
    "progression" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mentees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions_mentorat" (
    "id" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "dateHeure" TIMESTAMP(3) NOT NULL,
    "duree" INTEGER NOT NULL,
    "statut" "SessionStatut" NOT NULL DEFAULT 'PLANIFIEE',
    "typeSession" "TypeSession" NOT NULL DEFAULT 'VIDEO',
    "lienSession" TEXT,
    "compteRendu" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_mentorat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluations" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "note" INTEGER NOT NULL,
    "commentaire" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paiements" (
    "id" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "moyenPaiement" "MoyenPaiement" NOT NULL,
    "datePaiement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutPaiement" NOT NULL DEFAULT 'EN_ATTENTE',
    "reference" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paiements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credits" (
    "id" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "solde" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "dateDerniereRecharge" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matchings" (
    "id" TEXT NOT NULL,
    "menteeId" TEXT NOT NULL,
    "mentorId" TEXT NOT NULL,
    "scoreCompatibilite" DOUBLE PRECISION NOT NULL,
    "statut" "StatutMatching" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateMatching" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matchings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "competences" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,
    "niveau" "NiveauCompetence" NOT NULL,
    "categorie" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "competences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "dateEnvoi" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutNotification" NOT NULL DEFAULT 'NON_LU',
    "lien" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_numeroTelephone_key" ON "users"("numeroTelephone");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "mentors_userId_key" ON "mentors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "mentees_userId_key" ON "mentees"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "credits_menteeId_key" ON "credits"("menteeId");

-- CreateIndex
CREATE UNIQUE INDEX "competences_nom_key" ON "competences"("nom");

-- AddForeignKey
ALTER TABLE "mentors" ADD CONSTRAINT "mentors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mentees" ADD CONSTRAINT "mentees_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_mentorat" ADD CONSTRAINT "sessions_mentorat_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions_mentorat" ADD CONSTRAINT "sessions_mentorat_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "mentees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "sessions_mentorat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluations" ADD CONSTRAINT "evaluations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paiements" ADD CONSTRAINT "paiements_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "mentees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credits" ADD CONSTRAINT "credits_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "mentees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchings" ADD CONSTRAINT "matchings_menteeId_fkey" FOREIGN KEY ("menteeId") REFERENCES "mentees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matchings" ADD CONSTRAINT "matchings_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "mentors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
