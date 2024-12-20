import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateTableDto{

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "table name id is required"})
    name: string;

    @ApiProperty({ required: true })
    @IsString()
    @IsNotEmpty({message: "table description is required"})
    description: string;

    @ApiProperty({ required: true })
    @IsNumber()
    @IsNotEmpty({message: "user id is required"})
    fk_user_id: number;
}