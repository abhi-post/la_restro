import { Module } from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/Users.entity';
import { Shop } from 'src/typeorm/entities/Shop.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Shop])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
