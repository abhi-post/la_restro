import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { CategoriesService } from '../../services/categories/categories.service';
import { CreateCategoryDto } from '../../dtos/CreateCategory.dto';
import { UpdateCategoryDto } from '../../dtos/UpdateCategory.dto';

@Controller('categories')
export class CategoriesController {
    constructor(private categoryService: CategoriesService) { }

    @Get()
    getAll() {
        return this.categoryService.find();
    }

    @Get(':id')
    getOne(@Param('id') id: number) {
        return this.categoryService.findOne(id);
    }

    @Post()
    create(@Body() createCategoryDto: CreateCategoryDto) {
        return this.categoryService.create(createCategoryDto);
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
        return this.categoryService.update(id, updateCategoryDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.categoryService.delete(id);
    }
}
