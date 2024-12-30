import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTokenDto{

    @ApiProperty()
    @IsString()
    @IsNotEmpty({message: "Device Token is required"})
    fcm_device_token: string;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "user id is required"})
    fk_user_id: number;

}