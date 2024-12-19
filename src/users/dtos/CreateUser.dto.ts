import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserDto{

    @IsNumber()
    @IsNotEmpty({ message: "mobile number is required"})
    mobile_no: number;

    @IsString()
    @IsNotEmpty({ message: "enterprise_name is required"})
    enterprise_name: string;

    @IsString()
    @IsNotEmpty({ message: "password is required"})
    password: string;
}
