//student.types.ts
export interface Student {
  id: number;
  last_name: string;
  first_name: string;
  email: string;
  major: string | null;
  date_of_birth: string | null; 
}

export type StudentInput = Omit<Student, "id">;

export type StudentUpdateInput = Partial<StudentInput>;

export interface StudentStatistics {
  totalStudents: number;
  byMajor: { major: string; count: number }[];
  averageAge: number | null;
  recentStudents: Student[];
  totalByMajor: number;
}

export interface PaginationResult {
  students: Student[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StudentSearchResult {
  students: Student[];
  count: number;
}