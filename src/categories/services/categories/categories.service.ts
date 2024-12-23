import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from '../../../typeorm/entities/Category.entity';
import { Repository } from 'typeorm';
import { CreateCategoryParams, UpdateCategoryParams } from 'src/utils/types';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ){}

    async find(){
        try{
            const categories = await this.categoryRepository.find({ where: { is_active: true }});
            return {statusCode:200,message:"data found",data:categories}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async findOne(id: number){
        try{
            const category = await this.categoryRepository.findOne({ where: { id: id }});
            if (!category) {
                throw new NotFoundException();
            }

            return {statusCode:200,message:"data found",data:category}
        }catch(error){
            if(error.name == "NotFoundException"){
                throw new NotFoundException("Category not found");
            }
        }
    }

    async create(categoryDetails: CreateCategoryParams){
        try{
            const category = await this.categoryRepository.findOne({ where: { name: categoryDetails.name }});

            if (category) {
                throw new ConflictException();
            }

            const newCategory = await this.categoryRepository.create({
                ...categoryDetails,
                created_date: new Date(), 
                created_time: new Date()
            });
            return await this.categoryRepository.save(newCategory);
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "ConflictException"){
                throw new ConflictException("Category already exist");
            }

            throw new ServiceUnavailableException();
        }
        
    }

    async update(id: number, updateCategoryDetails: UpdateCategoryParams){
        try{
            const category = await this.categoryRepository.findOne({ where: { id: id }});
            if (!category) {
                throw new NotFoundException({ message: "Category not found, cannot update category" });
            }

            const existingCategory = await this.categoryRepository.findOne({ 
                where: { 
                    id: id,
                    name: updateCategoryDetails.name
                }});
            if (existingCategory) {
                throw new ConflictException({ message: "Category already exist, cannot update category" });
            }

            const updatedItem = await this.categoryRepository.update(id, { ...updateCategoryDetails })
            return {statusCode:200,message:"Category Updated",data: ""}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            if(error.name == "NotFoundException"){
                throw new NotFoundException(error.response.message);
            }
            if(error.name == "ConflictException"){
                throw new ConflictException(error.response.message);
            }
            throw new ServiceUnavailableException();
        }
    }

    async delete(id: number){
        try{
            const category = await this.categoryRepository.findOne({ where: { id: id } });
            if (!category) {
                return new NotFoundException();
            }
            const deletedItem = await this.categoryRepository.update(id, { is_active: false });
            if (deletedItem.affected === 1) {
                return {statusCode:200,message:"Category Deleted",data:""}
            }
            return { message: "Category not deleted" };
        }catch(error){
            console.log(error);
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "NotFoundException"){
                throw new NotFoundException('Category not found');
            }
            throw new ServiceUnavailableException();
        }
    }
}
