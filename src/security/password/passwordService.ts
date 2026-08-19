import bcrypt from 'bcryptjs';

export class PasswordService {
    private static instance: PasswordService;

    private constructor() {}

    public static getInstance(): PasswordService {
        if (!PasswordService.instance) {
            PasswordService.instance = new PasswordService();
        }
        return PasswordService.instance;
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = parseInt(process.env.BCRYPT_ROUNDS || '12');
        return await bcrypt.hash(password, saltRounds);
    }

    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    validatePasswordStrength(password: string): { valid: boolean; message?: string } {
        if (password.length < 8) {
            return { valid: false, message: 'Password must be at least 8 characters' };
        }
        if (!/[A-Z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one uppercase letter' };
        }
        if (!/[a-z]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one lowercase letter' };
        }
        if (!/[0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one number' };
        }
        if (!/[^A-Za-z0-9]/.test(password)) {
            return { valid: false, message: 'Password must contain at least one special character' };
        }
        return { valid: true };
    }
}

export default PasswordService.getInstance();