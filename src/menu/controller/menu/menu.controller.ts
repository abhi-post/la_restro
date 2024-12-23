import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MenuService } from '../../services/menu/menu.service';
import { CreateMenuDto } from '../../dtos/CreateMenu.dto';

@Controller('menu')
export class MenuController {
    constructor(private menuService: MenuService){}

    @Get()
    getAll(){
        return this.menuService.find();
    }

    @Get(':id')
    getOne(@Param('id') id: number){
        return this.menuService.findOne(id);
    }

    @Get('user_menu/:id')
    getMenuByUserId(@Param('id') id: number){
        return this.menuService.findMenuByUserId(id);
    }


    @Post('')
    create(@Body() createMenuDto: CreateMenuDto){
        return this.menuService.create(createMenuDto);  
    }
}
