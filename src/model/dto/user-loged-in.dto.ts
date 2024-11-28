import { IsNumber, IsString } from "class-validator";

export class UserLogedInDto{

    @IsString()
    idToken: string;

    @IsString()
    refreshToken: string;

    @IsNumber()
    expiresIn: number;
}