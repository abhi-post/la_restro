import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { CreateTableDto } from '../../dtos/CreateTable.dto';
import { UpdateTableDto } from '../../dtos/UpdateTable.dto';
import { TableService } from '../../services/table/table.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { ApiHeader } from '@nestjs/swagger';

@Controller('table')
export class TableController {
    constructor(private tableService: TableService){}

    @Get()
    getAll(){
        return this.tableService.find();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    getOne(@Param('id') id: number){
        return this.tableService.findOne(id);
    }

    @UseGuards(AuthGuard)
    @Get('user-table/:id')
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    getTableByUserId(@Param('id') id: number){
        return this.tableService.findTableByUserId(id);
    }

    @UseGuards(AuthGuard)
    @Post('/add-table')
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    create(@Body() CreateTableDto: CreateTableDto){
        return this.tableService.create(CreateTableDto);  
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    update(@Param('id') id: number, @Body() updateTableDto: UpdateTableDto) {
        return this.tableService.update(id, updateTableDto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @ApiHeader({
        name: 'Authorization',
        description: 'authorization for the request',
        required: true,
        schema: {type: 'string', example: 'custome-value'}
    })
    remove(@Param('id') id: number) {
        return this.tableService.delete(id);
    }
}
