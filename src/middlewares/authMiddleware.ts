import { Request, Response, NextFunction } from 'express';
import jwtService from '../security/jwt/jwtService';
import { ApiError } from '../utils/ApiError';
import userModel from '../models/userModel';

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwtService.verifyAccessToken(token);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            throw new ApiError(401, 'User not found');
        }
        if (!user.is_active) {
            throw new ApiError(401, 'User account is disabled');
        }
        req.user = { ...decoded, ...user };
        next();
    } catch (error) {
        next(error);
    }
};

export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            throw new ApiError(401, 'Not authenticated');
        }
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, 'Insufficient permissions');
        }
        next();
    };
};