import { Module } from '@nestjs/common';
import { UsersController } from './controller/users/users.controller';
import { UsersService } from './services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User.entity';
import { Shop } from '../typeorm/entities/Shop.entity';
import { Token } from '../typeorm/entities/Token.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Shop, Token])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
