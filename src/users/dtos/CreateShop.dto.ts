import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateShopDto{

    @IsString()
    @IsNotEmpty()
    shop_name: string;

    @IsNumber()
    @IsNotEmpty()
    mobile_no: number;

    @IsEmail()
    @IsOptional()
    email_id: string;

    @IsString()
    @IsOptional()
    title_name: string;
}