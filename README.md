# CRUD REST API — "Students" (TypeScript + Express + PostgreSQL)

This project covers:
- A full CRUD (Create, Read, Update, Delete)
- Centralized error handling
- Testing the API with Postman / Thunder Client

All the logic (controllers, routes, model) is written using
**arrow functions** (`const x = async () => {}`) rather than classic
`function` declarations.

## 1. Project structure

```
crud-students-api/
├── sql/
│   └── schema.sql              # table creation + sample data
├── src/
│   ├── config/db.ts            # PostgreSQL connection pool
│   ├── controllers/            # business logic (CRUD), arrow functions
│   ├── middlewares/
│   │   ├── asyncHandler.ts     # catches errors from async functions
│   │   └── errorHandler.ts     # centralized error handling
│   ├── models/                 # SQL queries (data access layer)
│   ├── routes/                 # HTTP method -> controller mapping
│   ├── types/                  # TypeScript interfaces
│   ├── utils/ApiError.ts       # custom error class
│   ├── app.ts                  # Express config (middlewares, routes)
│   └── server.ts               # entry point
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

## 2. Create the PostgreSQL database

If PostgreSQL isn't installed yet, download it from
https://www.postgresql.org/download/ (on Windows, the installer also
includes **pgAdmin** and the `psql` command-line tool).

### Option A — via psql (command line)

Open a terminal (on Windows: "SQL Shell (psql)" installed alongside
PostgreSQL, or a regular terminal if `psql` is on your PATH):

```bash
psql -U postgres
```

Enter the password you set during installation. Once connected:

```sql
CREATE DATABASE school_db;
\c school_db
```

Then paste the contents of `sql/schema.sql`, or run directly:

```bash
psql -U postgres -d school_db -f sql/schema.sql
```

### Option B — via pgAdmin (graphical interface)

1. Open pgAdmin and connect to the local server.
2. Right-click **Databases** → **Create** → **Database…**
3. Name it `school_db` → **Save**.
4. Right-click `school_db` → **Query Tool**, paste the contents of
   `sql/schema.sql`, then run it (▶️).

You should now have a `students` table with 2 sample rows.

## 3. Configure the connection (.env)

Copy `.env.example` to `.env` and adjust the values to your setup:

```bash
cp .env.example .env
```

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=school_db
```

`src/config/db.ts` reads this file to create the `pg` `Pool` — this is
the link between the API and the database.

## 4. Install dependencies and start the server

```bash
npm install
npm run dev
```

You should see in the console:

```
Connected to PostgreSQL
Server running on http://localhost:3000
```

## 5. Test with Postman / Thunder Client

| Action              | Method | URL             | Body (JSON)                                                                          |
|---------------------|--------|-----------------|----------------------------------------------------------------------------------------|
| List all students   | GET    | `/students`     | —                                                                                       |
| Read one student    | GET    | `/students/1`   | —                                                                                       |
| Create a student    | POST   | `/students`     | `{ "last_name": "Doe", "first_name": "Tom", "email": "tom@example.com", "major": "Web", "date_of_birth": "2002-05-10" }` |
| Full update         | PUT    | `/students/1`   | all fields required                                                                     |
| Partial update      | PATCH  | `/students/1`   | e.g. `{ "major": "Data" }`                                                              |
| Delete               | DELETE | `/students/1`   | —                                                                                       |

Also try a couple of intentional errors to verify the centralized handling:
- `GET /students/999` → `404` with `{ "success": false, "message": "..." }`
- `POST /students` with an empty body → `400`
- A route that doesn't exist, e.g. `GET /whatever` → generic `404`

## 6. Build for production (optional)

```bash
npm run build   # compiles src/ -> dist/ (JS)
npm start       # runs dist/server.js
```

## How does the centralized error handling work?

1. A controller (e.g. `getStudentById`) does `throw new ApiError(404, "...")`
   if the student doesn't exist — no try/catch.
2. Since the route is registered via `asyncHandler(getStudentById)`, any
   thrown error or rejected promise is automatically passed to `next(err)`.
3. Express routes it to the `errorHandler` middleware (declared last in
   `app.ts`), which returns a consistent JSON response with the right
   HTTP status code.

Result: no repeated `try/catch` blocks in the controllers, and a single
place to change if you ever want to alter the error response format.
