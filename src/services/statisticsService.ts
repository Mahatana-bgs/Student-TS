import studentRepository from '../repositories/studentRepository';
import { Student } from '../types/studentTypes';

interface StatisticsResponse {
    totalStudents: number;
    byMajor: { major: string; count: number }[];
    averageAge: number | null;
    recentStudents: Student[];
    totalByMajor: number;
}

class StatisticsService {
    private static instance: StatisticsService;

    private constructor() {}

    public static getInstance(): StatisticsService {
        if (!StatisticsService.instance) {
            StatisticsService.instance = new StatisticsService();
        }
        return StatisticsService.instance;
    }

    async getStudentStatistics(): Promise<StatisticsResponse> {
        const total = await studentRepository.count();
        const byMajor = await studentRepository.getStatisticsByMajor();
        const recentStudents = await studentRepository.getRecent(10);
        const averageAge = await this.calculateAverageAge();

        const totalByMajor = byMajor.reduce((sum, item) => sum + item.count, 0);

        return {
            totalStudents: total,
            byMajor,
            averageAge,
            recentStudents,
            totalByMajor
        };
    }

    async calculateAverageAge(): Promise<number | null> {
        const students = await studentRepository.findAll();
        if (students.length === 0) return null;

        let totalAge = 0;
        let count = 0;

        for (const student of students) {
            if (student.date_of_birth) {
                const age = this.calculateAge(new Date(student.date_of_birth));
                totalAge += age;
                count++;
            }
        }

        return count > 0 ? Math.round((totalAge / count) * 10) / 10 : null;
    }

    private calculateAge(birthDate: Date): number {
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    async getMajorDistribution(): Promise<{ major: string; count: number }[]> {
        return await studentRepository.getStatisticsByMajor();
    }

    async getTotalStudents(): Promise<number> {
        return await studentRepository.count();
    }

    async getRecentStudents(limit: number = 10): Promise<Student[]> {
        return await studentRepository.getRecent(limit);
    }
}

export default StatisticsService.getInstance();