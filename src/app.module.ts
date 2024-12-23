import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TYPEORM_CONFIG } from './config/constants';
import { AuthModule } from './auth/auth.module';
import { MenuModule } from './menu/menu.module';
import { TableModule } from './table/table.module';
import { CategoriesModule } from './categories/categories.module';
import databaseConfig from './config/database.config';

@Module({
  
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.get<TypeOrmModuleOptions>(TYPEORM_CONFIG),
    }),
    
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    UsersModule,
    AuthModule,
    MenuModule,
    TableModule,
    CategoriesModule 
  ],  
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
