import { Module } from '@nestjs/common';
import { MenuController } from './controller/menu/menu.controller';
import { MenuService } from './services/menu/menu.service';
import { Menu } from '../typeorm/entities/Menu.entity';
import { Category } from '../typeorm/entities/Category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../typeorm/entities/User.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Menu, Category]), AuthModule, UsersModule],
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
