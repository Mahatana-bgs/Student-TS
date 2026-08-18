//migrate.ts
import database from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const createTables = async () => {
    const db = database;

    try {
        await db.connect();
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'teacher')),
                is_active BOOLEAN DEFAULT true,
                last_login TIMESTAMP,
                refresh_token TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Users table created');
        
        await db.query(`
            CREATE TABLE IF NOT EXISTS students (
                id SERIAL PRIMARY KEY,
                first_name VARCHAR(100) NOT NULL,
                last_name VARCHAR(100) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                age INTEGER NOT NULL CHECK (age >= 16 AND age <= 99),
                grade VARCHAR(1) NOT NULL CHECK (grade IN ('A', 'B', 'C', 'D', 'E', 'F')),
                courses TEXT[] DEFAULT '{}',
                enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT true,
                created_by INTEGER REFERENCES users(id) ON DELETE SET NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Students table created');
        
        await db.query(`
            CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
            CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
            CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
            CREATE INDEX IF NOT EXISTS idx_students_grade ON students(grade);
            CREATE INDEX IF NOT EXISTS idx_students_name ON students(last_name, first_name);
        `);
        console.log('Indexes created');
        await db.query(`CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql'
        `);
        console.log(' Updated_at trigger function created');
        
        await db.query(`
            DROP TRIGGER IF EXISTS update_users_updated_at ON users;
            CREATE TRIGGER update_users_updated_at
                BEFORE UPDATE ON users
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('Users updated_at trigger created');

        await db.query(`
            DROP TRIGGER IF EXISTS update_students_updated_at ON students;
            CREATE TRIGGER update_students_updated_at
                BEFORE UPDATE ON students
                FOR EACH ROW
                EXECUTE FUNCTION update_updated_at_column();
        `);
        console.log('Students updated_at trigger created');
        console.log('Database migration completed successfully');
    } catch (error){
        console.error('Migration failed : ', error);
        process.exit(1);
    } finally {
        await db.disconnect();
    }
};

createTables();