-- Fichier d'initialisation PostgreSQL pour Databeez
-- Créer la base de données si elle n'existe pas
SELECT 'CREATE DATABASE databeez'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'databeez')\gexec

-- Connecter à la base de données databeez
\c databeez;

-- Créer l'extension uuid-ossp si elle n'existe pas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; 