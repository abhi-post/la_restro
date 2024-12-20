import { Module } from '@nestjs/common';
import { TableController } from './controllers/table/table.controller';
import { TableService } from './services/table/table.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User.entity';
import { Table } from '../typeorm/entities/Table.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Table])],
  controllers: [TableController],
  providers: [TableService]
})
export class TableModule {}
