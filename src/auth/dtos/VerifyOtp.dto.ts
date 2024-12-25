import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class VerifyOtpDto {
    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: "Mobile Number is required"})
    mobile_no: number;

    @ApiProperty()
    @IsNumber()
    @IsNotEmpty({ message: "OTP is required"})
    otp: number;

}