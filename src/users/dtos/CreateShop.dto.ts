import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShopDto{


    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    shop_name: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    mobile_no: number;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email_id: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    title_name: string;
}