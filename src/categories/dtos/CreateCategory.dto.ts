import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCategoryDto{

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "Category name is required"})
    name: string;

    @ApiProperty({ required: false})
    @IsString()
    @IsOptional()
    description: string;

}