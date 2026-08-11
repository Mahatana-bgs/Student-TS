import { pool } from "../config/db";
import { Etudiant, EtudiantInput, EtudiantUpdateInput } from "../types/etudiant.types";

export const findAll = async (): Promise<Etudiant[]> => {
  const result = await pool.query<Etudiant>(
    "SELECT * FROM etudiants ORDER BY id ASC"
  );
  return result.rows;
};

export const findById = async (id: number): Promise<Etudiant | null> => {
  const result = await pool.query<Etudiant>(
    "SELECT * FROM etudiants WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
};

export const create = async (data: EtudiantInput): Promise<Etudiant> => {
  const { nom, prenom, email, filiere, date_naissance } = data;
  const result = await pool.query<Etudiant>(
    `INSERT INTO etudiants (nom, prenom, email, filiere, date_naissance)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [nom, prenom, email, filiere ?? null, date_naissance ?? null]
  );
  return result.rows[0];
};

export const replace = async (
  id: number,
  data: EtudiantInput
): Promise<Etudiant | null> => {
  const { nom, prenom, email, filiere, date_naissance } = data;
  const result = await pool.query<Etudiant>(
    `UPDATE etudiants
     SET nom = $1, prenom = $2, email = $3, filiere = $4, date_naissance = $5
     WHERE id = $6
     RETURNING *`,
    [nom, prenom, email, filiere ?? null, date_naissance ?? null, id]
  );
  return result.rows[0] ?? null;
};

export const update = async (
  id: number,
  data: EtudiantUpdateInput
): Promise<Etudiant | null> => {
  const keys = Object.keys(data) as (keyof EtudiantUpdateInput)[];

  if (keys.length === 0) {
    return findById(id);
  }

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => data[key]);

  const result = await pool.query<Etudiant>(
    `UPDATE etudiants SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM etudiants WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
};
