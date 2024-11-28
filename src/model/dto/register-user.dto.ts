import { IsString } from "class-validator";
import { UserDto } from "./user.dto";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterUserDto extends UserDto{
    
    @ApiProperty({description: 'User display name'})
    @IsString()
    displayName: string;
}