import { TypeOrmModule } from '@nestjs/typeorm';
import { env } from '../../config';
import { DataSource } from 'typeorm';

export const PostgresDatasourceModule = TypeOrmModule.forRoot({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  entities: [`${__dirname}/../entities/*/*.{ts,js}`],
  synchronize: false,
  logging: false,
});

export const PostgresDatasourceMigration = new DataSource({
  type: 'postgres',
  host: env.database.host,
  port: env.database.port,
  username: env.database.username,
  password: env.database.password,
  database: env.database.name,
  migrations: [`${__dirname}/../migrations/*.ts`],
  subscribers: [],
  synchronize: false,
  logging: false,
});