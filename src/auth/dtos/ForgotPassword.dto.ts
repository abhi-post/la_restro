import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ForgotPasswordDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: "Mobile Number is required"})
    mobile_no: number;

}