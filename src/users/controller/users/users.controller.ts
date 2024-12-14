import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { identity } from 'rxjs';
import { CreateShopDto } from 'src/users/dtos/CreateShop.dto';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get()
    getUser(){
        return this.userService.findUser();
    }

    @Post()
    createUser(@Body() CreateUserDto: CreateUserDto){
        return this.userService.createUser(CreateUserDto);  
    }

    @Put(':id')
    updateUserById(
        @Param('id', ParseIntPipe) id:number, 
        @Body() UpdateUserDto: UpdateUserDto
    ){
        return this.userService.updateUser(id, UpdateUserDto);
    }

    @Delete(':id')
    deleteUserById(@Param('id', ParseIntPipe) id:number){
        return this.userService.deleteUser(id);
    }

    @Post(':id/register-shop')
    registerShop(
        @Param('id', ParseIntPipe) id:number,
        @Body() CreateShopDto: CreateShopDto
    ){
        return this.userService.createShop(id, CreateShopDto);  
    }
}
