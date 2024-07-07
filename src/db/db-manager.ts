import { DataSource, EntityManager } from "typeorm";
import dotenv from "dotenv";
dotenv.config();

const PORT: number = +(process.env.DB_PORT || 5432);
const USERNAME: string = process.env.DB_USERNAME || "";
const PASSWORD: string = process.env.DB_PASSWORD || "";
const DATABASE: string = process.env.DATABASE_NAME || "";
const HOST: string = process.env.DB_HOST || "";

const  DBSource: DataSource = new DataSource({
  type: "postgres",
  host: HOST,
  port: PORT,
  username: USERNAME,
  password: PASSWORD,
  database: DATABASE,
  logging: true,
  entities: ["src/db/entity/*.ts"],
  migrations: ["src/db/migration/*.ts"],
});

export async function getConnection(): Promise<EntityManager> {
  if (DBSource?.isInitialized) {
    console.log("DB Source is already initialized");
    return DBSource.manager;
  }
  try {
    await DBSource.initialize();
    console.log("DB Source initialized");
    return DBSource.manager;
  } catch (err: any) {
    console.log("DB Source failed to initialize");
    throw err;
  }
}

export default DBSource;