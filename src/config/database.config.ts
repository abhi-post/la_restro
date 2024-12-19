import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

function typeormModuleOptions(): TypeOrmModuleOptions {
  return {
    type: 'mysql',
    // host: process.env.DATABASE_HOST,
    // port: parseInt(process.env.DATABASE_PORT, 10),
    // username: process.env.DATABASE_USERNAME,
    // password: process.env.DATABASE_PASSWORD,
    // database: process.env.DATABASE_NAME,
    // entities: [join(__dirname, '../**/**/*entity{.ts,.js}')],
    // autoLoadEntities: true,
    // synchronize: false

    host: '217.21.94.52',
    port: 3306,
    username: 'u306182174_la_restro',
    password: 'XyE1tC7[uI',
    database: 'u306182174_la_restro',
    entities: [join(__dirname, '../**/**/*entity{.ts,.js}')],
    autoLoadEntities: true,
    synchronize: false

  }
   
}

export default registerAs('database', () => ({
  config: typeormModuleOptions()
}));