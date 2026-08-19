import { Student } from '../types/studentTypes';

class EmailService {
    private static instance: EmailService;

    private constructor() {}

    public static getInstance(): EmailService {
        if (!EmailService.instance) {
            EmailService.instance = new EmailService();
        }
        return EmailService.instance;
    }

    public validateEmail(email: string): boolean {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }

    public validateEmails(emails: string[]): { valid: string[]; invalid: string[] } {
        const valid: string[] = [];
        const invalid: string[] = [];

        for (const email of emails) {
            if (this.validateEmail(email)) {
                valid.push(email);
            } else {
                invalid.push(email);
            }
        }

        return { valid, invalid };
    }

    public async sendStudentRegistrationEmail(student: Student): Promise<void> {
        console.log(`📧 Email sent to ${student.email} - Student ${student.first_name} ${student.last_name} registered`);
        return Promise.resolve();
    }

    public async sendWelcomeEmail(email: string, name: string): Promise<void> {
        console.log(`📧 Welcome email sent to ${email} - Welcome ${name}!`);
        return Promise.resolve();
    }

    public async sendPasswordResetEmail(email: string, token: string): Promise<void> {
        console.log(`📧 Password reset email sent to ${email} - Token: ${token}`);
        return Promise.resolve();
    }
}

export default EmailService.getInstance();