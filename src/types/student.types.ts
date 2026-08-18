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
