import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMenuDto{

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "Product name is required"})
    name: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "Product description is required"})
    description: string;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "Product price is required"})
    price: number;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "Product selling price is required"})
    selling_price: number;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "Type of food is required"})
    type_of_food: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional({message: "No of product is optional"})
    no_of_product: number;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "category id is required"})
    fk_category_id: number;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "user id is required"})
    fk_user_id: number;
}