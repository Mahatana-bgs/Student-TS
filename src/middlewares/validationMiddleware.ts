import { body, validationResult, ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError';

export const validateStudent: ValidationChain[] = [
    body('first_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('First name contains invalid characters'),
    
    body('last_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s\-']+$/)
        .withMessage('Last name contains invalid characters'),
    
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('major')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Major too long'),
    
    body('date_of_birth')
        .optional()
        .isISO8601()
        .withMessage('Invalid date format. Use YYYY-MM-DD')
        .custom((value) => {
            const age = new Date().getFullYear() - new Date(value).getFullYear();
            if (age < 16 || age > 99) {
                throw new Error('Age must be between 16 and 99');
            }
            return true;
        }),
    
    body('age')
        .optional()
        .isInt({ min: 16, max: 99 })
        .withMessage('Age must be between 16 and 99'),
    
    body('grade')
        .optional()
        .isIn(['A', 'B', 'C', 'D', 'E', 'F'])
        .withMessage('Grade must be A, B, C, D, E, or F'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        throw new ApiError(400, firstError.msg);
    }
    next();
};

export const validateLogin: ValidationChain[] = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const validateRegister: ValidationChain[] = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/)
        .withMessage('Password must contain at least one special character'),
    
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    
    body('first_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),
    
    body('last_name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),
];

export const validateId = (req: Request, res: Response, next: NextFunction): void => {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id < 1) {
        throw new ApiError(400, 'Invalid ID format');
    }
    next();
};