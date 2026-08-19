import jwt from 'jsonwebtoken';
import { jwtConfig } from '../jwt/jwtConfig';

export class JwtService {
    private static instance: JwtService;

    private constructor() {}

    public static getInstance(): JwtService {
        if (!JwtService.instance) {
            JwtService.instance = new JwtService();
        }
        return JwtService.instance;
    }

    generateAccessToken(userId: number, email: string, role: string = 'user'): string {
        const payload = { userId, email, role };
        return jwt.sign(
            payload,
            jwtConfig.secret,
            { 
                expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn']
            }
        );
    }

    generateRefreshToken(userId: number, email: string): string {
        const payload = { userId, email };
        return jwt.sign(
            payload,
            jwtConfig.refreshSecret,
            { 
                expiresIn: jwtConfig.refreshExpiresIn as jwt.SignOptions['expiresIn']
            }
        );
    }

    verifyAccessToken(token: string): any {
        try {
            return jwt.verify(token, jwtConfig.secret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    verifyRefreshToken(token: string): any {
        try {
            return jwt.verify(token, jwtConfig.refreshSecret);
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }

    decodeToken(token: string): any {
        try {
            return jwt.decode(token);
        } catch (error) {
            return null;
        }
    }
}

export default JwtService.getInstance();