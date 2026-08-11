export interface Etudiant {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  filiere: string | null;
  date_naissance: string | null;
}

export type EtudiantInput = Omit<Etudiant, "id">;

export type EtudiantUpdateInput = Partial<EtudiantInput>;
