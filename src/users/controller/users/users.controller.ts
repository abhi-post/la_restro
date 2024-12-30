import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { identity } from 'rxjs';
import { CreateShopDto } from '../../dtos/CreateShop.dto';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { UpdateUserDto } from '../../dtos/UpdateUser.dto';
import { UsersService } from '../../services/users/users.service';
import { CreateTokenDto } from 'src/users/dtos/CreateToken.dto';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService){}

    @Get()
    getUser(){
        return this.userService.findUser();
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

    @Post('save-token')
    saveFcmToken(
        @Body() createTokenDto: CreateTokenDto
    ){
        return this.userService.saveToken(createTokenDto);  
    }
}
