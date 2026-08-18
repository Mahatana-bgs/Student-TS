//student.model.ts
import { pool } from "../config/db";
import { Student, StudentInput, StudentUpdateInput } from "../types/student.types";


export const findAll = async (): Promise<Student[]> => {
  const result = await pool.query<Student>(
    "SELECT * FROM students ORDER BY id ASC"
  );
  return result.rows;
};

export const findById = async (id: number): Promise<Student | null> => {
  const result = await pool.query<Student>(
    "SELECT * FROM students WHERE id = $1",
    [id]
  );
  return result.rows[0] ?? null;
};

export const create = async (data: StudentInput): Promise<Student> => {
  const { last_name, first_name, email, major, date_of_birth } = data;
  const result = await pool.query<Student>(
    `INSERT INTO students (last_name, first_name, email, major, date_of_birth)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [last_name, first_name, email, major ?? null, date_of_birth ?? null]
  );
  return result.rows[0];
};

export const replace = async (
  id: number,
  data: StudentInput
): Promise<Student | null> => {
  const { last_name, first_name, email, major, date_of_birth } = data;
  const result = await pool.query<Student>(
    `UPDATE students
     SET last_name = $1, first_name = $2, email = $3, major = $4, date_of_birth = $5
     WHERE id = $6
     RETURNING *`,
    [last_name, first_name, email, major ?? null, date_of_birth ?? null, id]
  );
  return result.rows[0] ?? null;
};

export const update = async (
  id: number,
  data: StudentUpdateInput
): Promise<Student | null> => {
  const keys = Object.keys(data) as (keyof StudentUpdateInput)[];

  if (keys.length === 0) {
    return findById(id);
  }

  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
  const values = keys.map((key) => data[key]);

  const result = await pool.query<Student>(
    `UPDATE students SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
    [...values, id]
  );
  return result.rows[0] ?? null;
};

export const remove = async (id: number): Promise<boolean> => {
  const result = await pool.query("DELETE FROM students WHERE id = $1", [id]);
  return (result.rowCount ?? 0) > 0;
};
