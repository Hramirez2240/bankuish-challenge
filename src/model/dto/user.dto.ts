import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";

export class UserDto{

    @ApiProperty({description: 'User email'})
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({description: 'User password'})
    @IsNotEmpty()
    @IsString()
    @Length(6, 20)
    password: string;
}