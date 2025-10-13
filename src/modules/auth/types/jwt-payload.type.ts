export interface JwtPayload {
  email: string;
  sub: string; // ID de l'utilisateur
  role: string;
  numeroTelephone: string;
  nom: string;
  prenom: string;
  photoProfil: string;
  dateInscription: Date;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  iat?: number; // Issued at (ajouté automatiquement par JWT)
  exp?: number; // Expiration (ajouté automatiquement par JWT)
} 