import { Module } from '@nestjs/common';
import { TableController } from './controllers/table/table.controller';
import { TableService } from './services/table/table.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User.entity';
import { Table } from '../typeorm/entities/Table.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Table]), AuthModule, UsersModule],
  controllers: [TableController],
  providers: [TableService]
})
export class TableModule {}
