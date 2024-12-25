import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ResetPasswordDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty({ message: "Password is required"})
    password: string;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: "mobile is required"})
    mobile_no: number;

}