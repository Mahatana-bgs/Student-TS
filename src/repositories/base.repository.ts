import { pool } from '../config/db';
import database from '../config/db';
import { QueryResult } from 'pg';

export class BaseRepository<T> {
    protected tableName: string;

    constructor(tableName: string) {
        this.tableName = tableName;
    }

    protected async query(text: string, params?: any[]): Promise<QueryResult> {
        return await database.query(text, params);
    }

    async findAll(): Promise<T[]> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} ORDER BY id ASC`
        );
        return result.rows;
    }

    async findById(id: number): Promise<T | null> {
        const result = await this.query(
            `SELECT * FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
        return result.rows[0] ?? null;
    }

    async create(data: Partial<T>): Promise<T> {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        const columns = keys.join(', ');

        const result = await this.query(
            `INSERT INTO ${this.tableName} (${columns}) VALUES (${placeholders}) RETURNING *`,
            values
        );
        return result.rows[0];
    }

    async update(id: number, data: Partial<T>): Promise<T | null> {
        const keys = Object.keys(data);
        if (keys.length === 0) {
            return this.findById(id);
        }

        const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
        const values = keys.map(key => (data as any)[key]);

        const result = await this.query(
            `UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`,
            [...values, id]
        );
        return result.rows[0] ?? null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await this.query(
            `DELETE FROM ${this.tableName} WHERE id = $1`,
            [id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async count(): Promise<number> {
        const result = await this.query(
            `SELECT COUNT(*) FROM ${this.tableName}`
        );
        return parseInt(result.rows[0].count);
    }
}