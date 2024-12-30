import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MenuService } from '../../services/menu/menu.service';
import { CreateMenuDto } from '../../dtos/CreateMenu.dto';
import { ApiHeader } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService){}

    @Get()
    getAll(){
        return this.menuService.find();
    }

    @UseGuards(AuthGuard)
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    @Get(':id')
    getOne(@Param('id') id: number){
        return this.menuService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    @Get('user-menu/:id')
    getMenuByUserId(@Param('id') id: number){
        return this.menuService.findMenuByUserId(id);
    }

    @UseGuards(AuthGuard)
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    @Post('')
    create(@Body() createMenuDto: CreateMenuDto){
        return this.menuService.create(createMenuDto);  
    }
}
