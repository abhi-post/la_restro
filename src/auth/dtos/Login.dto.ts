import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto{
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty()
    mobile_no: number;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    password: string;
}
