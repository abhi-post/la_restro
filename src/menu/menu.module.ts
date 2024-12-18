import { Module } from '@nestjs/common';
import { MenuController } from './controller/menu/menu.controller';
import { MenuService } from './services/menu/menu.service';

@Module({
  controllers: [MenuController],
  providers: [MenuService]
})
export class MenuModule {}
