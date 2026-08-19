import { Request, Response, NextFunction } from 'express';
import userModel from '../models/userModel';
import jwtService from '../security/jwt/jwtService';
import passwordService from '../security/password/passwordService';
import { ApiError } from '../utils/ApiError';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password, first_name, last_name, role } = req.body;
        const existingUser = await userModel.findByEmail(email);
        if (existingUser) {
            throw new ApiError(400, 'User already exists');
        }

        const user = await userModel.create(email, password, first_name, last_name, role || 'user');
        const accessToken = jwtService.generateAccessToken(user.id, user.email, user.role);
        const refreshToken = jwtService.generateRefreshToken(user.id, user.email);
        await userModel.updateRefreshToken(user.id, refreshToken);
        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findByEmail(email);
        if (!user) {
            throw new ApiError(401, 'Invalid credentials');
        }

        const isPasswordValid = await passwordService.comparePasswords(password, user.password);
        if (!isPasswordValid) {
            throw new ApiError(401, 'Invalid credentials');
        }
        if (!user.is_active) {
            throw new ApiError(401, 'Account is disabled');
        }

        const accessToken = jwtService.generateAccessToken(user.id, user.email, user.role);
        const refreshToken = jwtService.generateRefreshToken(user.id, user.email);
        await userModel.updateRefreshToken(user.id, refreshToken);
        await userModel.updateLastLogin(user.id);
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    role: user.role
                },
                accessToken,
                refreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            throw new ApiError(400, 'Refresh token required');
        }

        const decoded = jwtService.verifyRefreshToken(refreshToken);
        const user = await userModel.findById(decoded.userId);
        if (!user) {
            throw new ApiError(401, 'Invalid refresh token');
        }
        const newAccessToken = jwtService.generateAccessToken(user.id, user.email, user.role);
        const newRefreshToken = jwtService.generateRefreshToken(user.id, user.email);
        await userModel.updateRefreshToken(user.id, newRefreshToken);
        res.status(200).json({
            success: true,
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken
            }
        });
    } catch (error) {
        next(error);
    }
};

export const logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const userId = req.user?.userId;
        if (userId) {
            await userModel.updateRefreshToken(userId, null);
        }
        res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        next(error);
    }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await userModel.findById(req.user?.userId);
        if (!user) {
            throw new ApiError(404, 'User not found');
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};