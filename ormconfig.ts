import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

const PORT: number = +(process.env.DB_PORT || 5432);
const USERNAME: string = process.env.DB_USERNAME || "postgres";
const PASSWORD: string = process.env.DB_PASSWORD || "postgres";
const DATABASE: string = process.env.DATABASE_NAME || "POC";
const HOST: string = process.env.DB_HOST || "localhost";

const dataSource = new DataSource({
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

export default dataSource;
