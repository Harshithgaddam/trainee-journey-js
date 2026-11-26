
import 'dotenv/config';
import { DataSource } from 'typeorm';

import { User } from './database/entities/user.entity';
import { Task } from './database/entities/task.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME ?? 'postgres',
  password: process.env.DB_PASSWORD ?? '',
  database: process.env.DB_DATABASE ?? 'task_api',

  entities: [User, Task],

  migrations: [
    __dirname + '/database/migrations/*{.ts,.js}',
  ],

  synchronize: false,
});
