import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class LoginDto{
    @IsNumber()
    @IsNotEmpty()
    mobile_no: number;

    @IsString()
    @IsNotEmpty()
    password: string;
}
