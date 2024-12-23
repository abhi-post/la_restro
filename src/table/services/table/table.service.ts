import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Table } from '../../../typeorm/entities/Table.entity';
import { User } from '../../../typeorm/entities/User.entity';
import { CreateTableParams, UpdateTableParams } from '../../../utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class TableService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Table) private tableRepository: Repository<Table>
    ){}

    async find(){
        try{
            const tables = await this.tableRepository.find({ relations: ['fk_user_id']});
            return {statusCode:200,message:"data found",data:tables}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async findOne(id: number){
        try{
            const table = await this.tableRepository.findOne({ where: { id: id }});
            if (!table) {
                throw new NotFoundException();
            }

            return {statusCode:200,message:"data found",data:table}
        }catch(error){
            if(error.name == "NotFoundException"){
                throw new NotFoundException("Table not found");
            }
        }
    }

    async findTableByUserId(user_id: number){
        try{
            const table = await this.tableRepository.find({ where: { fk_user_id: {id: user_id} }});
            if (!table) {
                throw new NotFoundException();
            }

            return {statusCode:200,message:"data found",data:table}
        }catch(error){
            if(error.name == "NotFoundException"){
                throw new NotFoundException("No Table found");
            }
        }
    }

    async create(tableDetails: CreateTableParams){
        try{
            const user = await this.userRepository.findOne({ where: { id: tableDetails.fk_user_id }});
            if (!user) {
                throw new NotFoundException();
            }

            const table = await this.tableRepository.findOne({ where: { name: tableDetails.name, fk_user_id: { id: tableDetails.fk_user_id } } });

            if (table) {
                throw new ConflictException();
            }

            const newTable = await this.tableRepository.create({
                ...tableDetails,
                fk_user_id: user,
                created_date: new Date(), 
                created_time: new Date()
            });
            return await this.tableRepository.save(newTable);
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "NotFoundException"){
                throw new NotFoundException('User not found, cannot create table');
            }

            if(error.name == "ConflictException"){
                throw new ConflictException("Table already exist");
            }

            throw new ServiceUnavailableException();
        }
        
    }

    async update(id: number, updateTableDetails: UpdateTableParams){
        try{
            const table = await this.tableRepository.findOne({ where: { id: id }});
            if (!table) {
                throw new NotFoundException({ message: "Table not found, cannot update table" });
            }

            const user = await this.userRepository.findOne({ where: { id: updateTableDetails.fk_user_id } });
            if (!user) {
                throw new NotFoundException({ message: "User not found, cannot update table" });
            }

            const existingTable = await this.tableRepository.findOne({ 
                where: { 
                    fk_user_id: {id: updateTableDetails.fk_user_id},
                    name: updateTableDetails.name
                }});
            if (existingTable) {
                throw new ConflictException({ message: "Table already exist, cannot update table" });
            }

            const updatedItem = await this.tableRepository.update(id, { ...updateTableDetails, fk_user_id: user })
            return {statusCode:200,message:"Table Updated",data:updatedItem}
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
            const table = await this.tableRepository.findOne({ where: { id: id } });
            if (!table) {
                return new NotFoundException();
            }
            await this.tableRepository.delete(id);
            return {statusCode:200,message:"Table Deleted",data:""}
        }catch(error){
            console.log(error);
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "NotFoundException"){
                throw new NotFoundException('Table not found');
            }
            throw new ServiceUnavailableException();
        }
    }
}
