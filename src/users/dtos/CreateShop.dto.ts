import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShopDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: "shop title is required"})
    title_name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    shop_address: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    shop_logo: string;

}