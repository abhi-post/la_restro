import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../../../typeorm/entities/Menu.entity';
import { User } from '../../../typeorm/entities/User.entity';
import { Repository, Table } from 'typeorm';
import { Category } from '../../../typeorm/entities/Category.entity';
import { CreateMenuParams } from '../../../utils/types';

@Injectable()
export class MenuService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Menu) private menuRepository: Repository<Menu>,
        @InjectRepository(Category) private categoryRepository: Repository<Category>
    ){}

    async find(){
        try{
            const menus = await this.menuRepository.find({ relations: ['fk_user_id', 'fk_category_id']});
            return {statusCode:200,message:"data found",data:menus}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async findOne(id: number){
        try{
            const menu = await this.menuRepository.findOne({ where: { id: id }});
            if (!menu) {
                throw new NotFoundException();
            }

            return {statusCode:200,message:"data found",data:menu}
        }catch(error){
            if(error.name == "NotFoundException"){
                throw new NotFoundException("Table not found");
            }
        }
    }

    async findMenuByUserId(user_id: number){
        try{
            const menu = await this.menuRepository.find({ where: { fk_user_id: {id: user_id} }});
            if (!menu) {
                throw new NotFoundException();
            }

            return {statusCode:200,message:"data found",data:menu}
        }catch(error){
            if(error.name == "NotFoundException"){
                throw new NotFoundException("No Table found");
            }
        }
    }
    
    async create(menuDetails: CreateMenuParams){
        try{
            const user = await this.userRepository.findOne({ where: { id: menuDetails.fk_user_id }});
            if (!user) {
                throw new NotFoundException( { message: "User Not found, can't create menu" });
            }

            const category = await this.categoryRepository.findOne({ where: { id: menuDetails.fk_category_id }});
            if (!category) {
                throw new NotFoundException({ message: "category Not found, can't create menu" });
            }

            const menu = await this.menuRepository.findOne({ where: {name: menuDetails.name, fk_user_id: { id: menuDetails.fk_user_id }, fk_category_id: { id: menuDetails.fk_category_id }}});

            if (menu) {
                throw new ConflictException();
            }

            const jsonTax = {
                cgst: 0,
                sgst: 0
            };

            const newMenu = await this.menuRepository.create({
                ...menuDetails,
                taxes: jsonTax,
                fk_user_id: user,
                fk_category_id: category,
                created_date: new Date(), 
                created_time: new Date()
            });

            console.log(newMenu);

            return await this.menuRepository.save(newMenu);
        }catch(error){
            console.log(error);
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "NotFoundException"){
                throw new NotFoundException(error.response.message);
            }

            if(error.name == "ConflictException"){
                throw new ConflictException("Menu already exist");
            }

            throw new ServiceUnavailableException();
        }
        
    }
}
