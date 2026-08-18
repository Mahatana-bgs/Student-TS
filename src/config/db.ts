import { Pool, PoolConfig, QueryResult, QueryResultRow } from "pg";
import dotenv from "dotenv";

dotenv.config();

const poolConfig: PoolConfig ={
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "postgres",
  password: process.env.DB_PASSWORD || "postgres",
  database: process.env.DB_NAME || "school_db",
  max: Number (process.env.DB_MAX_POOL) || 20,
  idleTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT) || 30000,
  connectionTimeoutMillis: Number(process.env.DB_CONNECTION_TIMEOUT) || 2000,
};

class Database {
  private static instance: Database;
  private pool: Pool;
  private isConnected: boolean = false;

  private constructor(){
    this.pool = new Pool(poolConfig);

    this.pool.on('connect', () => {
      console.log('PostgreSQL connected');
      this.isConnected = true;
    });

    this.pool.on('error', (err) => {
      console.error('Unexpected error on PostgreSQL pool: ', err);
      this.isConnected = false;
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      const client = await this.pool.connect();
      console.log('PostgreSQL connection successful');
      client.release();
      this.isConnected = true;  
    } catch (err) {
      console.error('PostgreSql connection error: ', err);
      process.exit(1);
    }
  }

  public async disconnect(): Promise<void> {
    if(this.isConnected){
      await this.pool.end();
      this.isConnected = false;
      console.log('PostgreSQL disconnected');
      
    }
  }

  public async query<T extends QueryResultRow = any>(
    text:  string,
    param?: any[]
  ): Promise<QueryResult<T>> {
    const client = await this.pool.connect();
    try {
      const result = await client.query<T>(text, param);
      return result;
    } finally {
      client.release();
    }
  }

  public async getClient() {
        return await this.pool.connect();
    }

    public getPool(): Pool {
        return this.pool;
    }

    public getConnectionStatus(): boolean {
        return this.isConnected;
    }
}

export default Database.getInstance();