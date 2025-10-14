/*
  Warnings:

  - You are about to drop the `competences` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `credits` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `evaluations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `matchings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentees` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mentors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `notifications` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `paiements` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sessions_mentorat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."credits" DROP CONSTRAINT "credits_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."evaluations" DROP CONSTRAINT "evaluations_sessionId_fkey";

-- DropForeignKey
ALTER TABLE "public"."evaluations" DROP CONSTRAINT "evaluations_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."matchings" DROP CONSTRAINT "matchings_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."matchings" DROP CONSTRAINT "matchings_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentees" DROP CONSTRAINT "mentees_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."mentors" DROP CONSTRAINT "mentors_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."notifications" DROP CONSTRAINT "notifications_utilisateurId_fkey";

-- DropForeignKey
ALTER TABLE "public"."paiements" DROP CONSTRAINT "paiements_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions_mentorat" DROP CONSTRAINT "sessions_mentorat_menteeId_fkey";

-- DropForeignKey
ALTER TABLE "public"."sessions_mentorat" DROP CONSTRAINT "sessions_mentorat_mentorId_fkey";

-- DropTable
DROP TABLE "public"."competences";

-- DropTable
DROP TABLE "public"."credits";

-- DropTable
DROP TABLE "public"."evaluations";

-- DropTable
DROP TABLE "public"."matchings";

-- DropTable
DROP TABLE "public"."mentees";

-- DropTable
DROP TABLE "public"."mentors";

-- DropTable
DROP TABLE "public"."notifications";

-- DropTable
DROP TABLE "public"."paiements";

-- DropTable
DROP TABLE "public"."sessions_mentorat";

-- DropTable
DROP TABLE "public"."users";

-- DropEnum
DROP TYPE "public"."MoyenPaiement";

-- DropEnum
DROP TYPE "public"."NiveauCompetence";

-- DropEnum
DROP TYPE "public"."SessionStatut";

-- DropEnum
DROP TYPE "public"."StatutMatching";

-- DropEnum
DROP TYPE "public"."StatutNotification";

-- DropEnum
DROP TYPE "public"."StatutPaiement";

-- DropEnum
DROP TYPE "public"."TypeNotification";

-- DropEnum
DROP TYPE "public"."TypeSession";

-- DropEnum
DROP TYPE "public"."UserRole";

-- CreateTable
CREATE TABLE "Utilisateur" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Utilisateur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentee" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "biographie" TEXT,
    "numeroTelephone" TEXT,
    "photoProfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentor" (
    "id" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,
    "domaineExpertise" TEXT NOT NULL,
    "anneesExperience" INTEGER NOT NULL,
    "biographie" TEXT,
    "noteMoyenne" DOUBLE PRECISION,
    "tarifParSession" DOUBLE PRECISION,
    "disponibilites" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Utilisateur_email_key" ON "Utilisateur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Mentee_utilisateurId_key" ON "Mentee"("utilisateurId");

-- CreateIndex
CREATE UNIQUE INDEX "Mentor_utilisateurId_key" ON "Mentor"("utilisateurId");

-- AddForeignKey
ALTER TABLE "Mentee" ADD CONSTRAINT "Mentee_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "Utilisateur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
