import { pool } from '../config/db';
import passwordService from '../security/password/passwordService';

export class UserModel {
    async create(email: string, password: string, firstName: string, lastName: string, role: string = 'user'): Promise<any> {
        const hashedPassword = await passwordService.hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (email, password, first_name, last_name, role)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, email, first_name, last_name, role, created_at`,
            [email, hashedPassword, firstName, lastName, role]
        );
        return result.rows[0];
    }

    async findByEmail(email: string): Promise<any> {
        const result = await pool.query(
            `SELECT id, email, password, first_name, last_name, role, is_active
             FROM users WHERE email = $1`,
            [email]
        );
        return result.rows[0] || null;
    }

    async findById(id: number): Promise<any> {
        const result = await pool.query(
            `SELECT id, email, first_name, last_name, role, is_active, last_login
             FROM users WHERE id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async updateRefreshToken(userId: number, refreshToken: string | null): Promise<void> {
        await pool.query(
            `UPDATE users SET refresh_token = $1 WHERE id = $2`,
            [refreshToken, userId]
        );
    }

    async updateLastLogin(userId: number): Promise<void> {
        await pool.query(
            `UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1`,
            [userId]
        );
    }

    async setActive(userId: number, isActive: boolean): Promise<void> {
        await pool.query(
            `UPDATE users SET is_active = $1 WHERE id = $2`,
            [isActive, userId]
        );
    }
}

export default new UserModel();