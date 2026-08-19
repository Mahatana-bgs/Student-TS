import studentRepository from '../repositories/studentRepository';
import emailService from './emailService';
import { ApiError } from '../utils/ApiError';
import { Student, StudentInput, StudentUpdateInput } from '../types/studentTypes';

class StudentService {
    private static instance: StudentService;

    private constructor() {}

    public static getInstance(): StudentService {
        if (!StudentService.instance) {
            StudentService.instance = new StudentService();
        }
        return StudentService.instance;
    }

    async createStudent(data: StudentInput): Promise<Student> {
        if (!emailService.validateEmail(data.email)) {
            throw new ApiError(400, 'Invalid email format');
        }

        const existingStudent = await studentRepository.findByEmail(data.email);
        if (existingStudent) {
            throw new ApiError(400, 'Email already in use');
        }

        if (!data.first_name || data.first_name.length < 2) {
            throw new ApiError(400, 'First name must be at least 2 characters');
        }
        if (!data.last_name || data.last_name.length < 2) {
            throw new ApiError(400, 'Last name must be at least 2 characters');
        }

        const student = await studentRepository.create(data);
        
        emailService.sendStudentRegistrationEmail(student).catch(console.error);

        return student;
    }

    async getAllStudents(): Promise<Student[]> {
        return await studentRepository.findAll();
    }

    async getStudentById(id: number): Promise<Student> {
        const student = await studentRepository.findById(id);
        if (!student) {
            throw new ApiError(404, `Student with id ${id} not found`);
        }
        return student;
    }

    async updateStudent(id: number, data: StudentUpdateInput): Promise<Student> {
        await this.getStudentById(id);

        if (data.email) {
            if (!emailService.validateEmail(data.email)) {
                throw new ApiError(400, 'Invalid email format');
            }
            const existingStudent = await studentRepository.findByEmail(data.email);
            if (existingStudent && existingStudent.id !== id) {
                throw new ApiError(400, 'Email already in use');
            }
        }

        const student = await studentRepository.update(id, data);
        if (!student) {
            throw new ApiError(404, `Student with id ${id} not found`);
        }

        return student;
    }

    async replaceStudent(id: number, data: StudentInput): Promise<Student> {
        await this.getStudentById(id);

        if (!emailService.validateEmail(data.email)) {
            throw new ApiError(400, 'Invalid email format');
        }

        const student = await studentRepository.replace(id, data);
        if (!student) {
            throw new ApiError(404, `Student with id ${id} not found`);
        }

        return student;
    }

    async deleteStudent(id: number): Promise<void> {
        const deleted = await studentRepository.delete(id);
        if (!deleted) {
            throw new ApiError(404, `Student with id ${id} not found`);
        }
    }

    async searchStudents(searchTerm: string): Promise<Student[]> {
        if (!searchTerm || searchTerm.length < 2) {
            throw new ApiError(400, 'Search term must be at least 2 characters');
        }
        return await studentRepository.search(searchTerm);
    }

    async getStudentsWithPagination(
        page: number = 1,
        limit: number = 10,
        filter: any = {}
    ): Promise<{ students: Student[]; pagination: any }> {
        const result = await studentRepository.findWithPagination(page, limit, filter);
        
        return {
            students: result.students,
            pagination: {
                page,
                limit,
                total: result.total,
                totalPages: Math.ceil(result.total / limit)
            }
        };
    }

    async getStudentsByMajor(major: string): Promise<Student[]> {
        const allStudents = await studentRepository.findAll();
        return allStudents.filter(s => s.major === major);
    }
}

export default StudentService.getInstance();