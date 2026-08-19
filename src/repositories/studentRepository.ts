import { pool } from '../config/db';
import { Student, StudentInput, StudentUpdateInput } from '../types/studentTypes';
import { BaseRepository } from './baseRepository';

export class StudentRepository extends BaseRepository<Student> {
    constructor() {
        super('students');
    }

    async findAll(): Promise<Student[]> {
        const result = await pool.query<Student>(
            "SELECT * FROM students ORDER BY id ASC"
        );
        return result.rows;
    }

    async findById(id: number): Promise<Student | null> {
        const result = await pool.query<Student>(
            "SELECT * FROM students WHERE id = $1",
            [id]
        );
        return result.rows[0] ?? null;
    }

    async create(data: StudentInput): Promise<Student> {
        const { last_name, first_name, email, major, date_of_birth } = data;
        const result = await pool.query<Student>(
            `INSERT INTO students (last_name, first_name, email, major, date_of_birth)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [last_name, first_name, email, major ?? null, date_of_birth ?? null]
        );
        return result.rows[0];
    }

    async replace(id: number, data: StudentInput): Promise<Student | null> {
        const { last_name, first_name, email, major, date_of_birth } = data;
        const result = await pool.query<Student>(
            `UPDATE students
            SET last_name = $1, first_name = $2, email = $3, major = $4, date_of_birth = $5
            WHERE id = $6
            RETURNING *`,
            [last_name, first_name, email, major ?? null, date_of_birth ?? null, id]
        );
        return result.rows[0] ?? null;
    }

    async update(id: number, data: StudentUpdateInput): Promise<Student | null> {
        const keys = Object.keys(data) as (keyof StudentUpdateInput)[];

        if (keys.length === 0) {
            return this.findById(id);
        }

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
        const values = keys.map((key) => (data as any)[key]);

        const result = await pool.query<Student>(
            `UPDATE students SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query(
            "DELETE FROM students WHERE id = $1",
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async findByEmail(email: string): Promise<Student | null> {
        const result = await pool.query<Student>(
            "SELECT * FROM students WHERE email = $1",
            [email]
        );
        return result.rows[0] ?? null;
    }

    async search(searchTerm: string): Promise<Student[]> {
        const result = await pool.query<Student>(
            `SELECT * FROM students 
             WHERE first_name ILIKE $1 
                OR last_name ILIKE $1 
                OR email ILIKE $1
             LIMIT 20`,
            [`%${searchTerm}%`]
        );
        return result.rows;
    }

    async getStatisticsByMajor(): Promise<{ major: string; count: number }[]> {
        const result = await pool.query(
            `SELECT major, COUNT(*) as count
             FROM students
             WHERE major IS NOT NULL
             GROUP BY major
             ORDER BY count DESC`
        );
        return result.rows;
    }

    async findWithPagination(
        page: number = 1,
        limit: number = 10,
        filter: any = {}
    ): Promise<{ students: Student[]; total: number }> {
        const offset = (page - 1) * limit;
        let whereClause = 'WHERE 1=1';
        const values: any[] = [];
        let paramIndex = 1;

        if (filter.major) {
            whereClause += ` AND major = $${paramIndex++}`;
            values.push(filter.major);
        }
        if (filter.search) {
            whereClause += ` AND (first_name ILIKE $${paramIndex++} OR last_name ILIKE $${paramIndex++})`;
            values.push(`%${filter.search}%`, `%${filter.search}%`);
        }

        const countResult = await pool.query(
            `SELECT COUNT(*) FROM students ${whereClause}`,
            values
        );
        const total = parseInt(countResult.rows[0].count);

        values.push(limit, offset);
        const result = await pool.query<Student>(
            `SELECT * FROM students ${whereClause} ORDER BY id LIMIT $${paramIndex++} OFFSET $${paramIndex++}`,
            values
        );

        return {
            students: result.rows,
            total
        };
    }

    async getRecent(limit: number = 10): Promise<Student[]> {
        const result = await pool.query<Student>(
            "SELECT * FROM students ORDER BY id DESC LIMIT $1",
            [limit]
        );
        return result.rows;
    }
}

export default new StudentRepository();