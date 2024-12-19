import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UpdateUserDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    mobile_no: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}