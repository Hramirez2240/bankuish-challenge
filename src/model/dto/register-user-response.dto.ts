import { IsEmail } from "class-validator";

export class RegisterUserResponseDto{

    @IsEmail()
    email: string;
}