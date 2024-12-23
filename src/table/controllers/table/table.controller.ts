import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateTableDto } from '../../dtos/CreateTable.dto';
import { UpdateTableDto } from '../../dtos/UpdateTable.dto';
import { TableService } from '../../services/table/table.service';

@Controller('table')
export class TableController {
    constructor(private tableService: TableService){}

    @Get()
    getAll(){
        return this.tableService.find();
    }

    @Get(':id')
    getOne(@Param('id') id: number){
        return this.tableService.findOne(id);
    }

    @Get('user_table/:id')
    getTableByUserId(@Param('id') id: number){
        return this.tableService.findTableByUserId(id);
    }

    @Post('/add-table')
    create(@Body() CreateTableDto: CreateTableDto){
        return this.tableService.create(CreateTableDto);  
    }

    @Patch(':id')
    update(@Param('id') id: number, @Body() updateTableDto: UpdateTableDto) {
        return this.tableService.update(id, updateTableDto);
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.tableService.delete(id);
    }
}
