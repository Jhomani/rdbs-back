import {Pool} from 'pg';

export class PostgreSQL {
  private static instance: PostgreSQL;
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: '172.17.0.2',
      database: 'atm',
      user: 'postgres',
      password: '34353435',
      port: 5432,
    });
  }

  public static getInstance(): PostgreSQL {
    if (!PostgreSQL.instance) PostgreSQL.instance = new PostgreSQL();

    return PostgreSQL.instance;
  }

  public async singleQuery(query: string) {
    const client = await this.pool.connect();
    const result = client.query(query);

    client.release();

    return result;
  }

  public async connect() {
    return this.pool.connect();
  }
}
