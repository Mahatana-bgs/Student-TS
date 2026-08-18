//schema.sql

CREATE TABLE IF NOT EXISTS students (
    id              SERIAL PRIMARY KEY,
    last_name       VARCHAR(100) NOT NULL,
    first_name      VARCHAR(100) NOT NULL,
    email           VARCHAR(150) NOT NULL UNIQUE,
    major           VARCHAR(100),
    date_of_birth   DATE
);

INSERT INTO students (last_name, first_name, email, major, date_of_birth) VALUES
    ('Smith', 'John', 'john.smith@example.com', 'Computer Science', '2001-03-15'),
    ('Doe',   'Emma', 'emma.doe@example.com',   'Networking',       '2000-11-02')
ON CONFLICT (email) DO NOTHING;
