import { Module } from '@nestjs/common';
import { CategoriesController } from './controller/categories/categories.controller';
import { CategoriesService } from './services/categories/categories.service';
import { Category } from '../typeorm/entities/Category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoriesController],
  providers: [CategoriesService]
})
export class CategoriesModule {}
