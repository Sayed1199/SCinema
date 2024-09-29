import { registerAs } from "@nestjs/config";
import { config as dotenvConfig } from "dotenv";
import { DataSource, DataSourceOptions } from "typeorm";

dotenvConfig({ path: '.env' });

console.log(process.env.DATABASE_USERNAME)

const config = {
    type: 'postgres', 
    host: `${process.env.DATABASE_HOST}`, 
    port: process.env.DATABASE_PORT, 
    username: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    database: `${process.env.DATABASE_NAME}`,
    entities: ["dist/**/*.entity{.ts,.js}"],
    migrations: ["dist/migrations/*{.ts,.js}"],
    autoLoadEntities: true,
    synchronize: process.env.ENVIRONEMNET.toString() == "production"? false : true,
    logging: process.env.ENVIRONEMNET.toString() == "production"? false : true,
    ssl: true
}

export default registerAs('typeorm', () => config)
export const connectionSource = new DataSource(config as DataSourceOptions);