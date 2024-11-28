import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { UserDto } from "src/model/dto/user.dto";
import { AuthService } from "./auth.service";
import { RegisterUserDto } from "src/model/dto/register-user.dto";
import { BaseResponseDto } from "src/model/dto/common/base-response.dto";
import { RegisterUserResponseDto } from "src/model/dto/register-user-response.dto";

@Controller('auth')
export class AuthController{

    constructor(
        private readonly authService: AuthService
    )
    {}

    @ApiOperation({ operationId: 'registerUser' })
    @Post('/register')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Register new user in firebase and save in database.'
    })
    register(@Body() request: RegisterUserDto): Promise<BaseResponseDto<RegisterUserResponseDto>>{
        return this.authService.registerUser(request);
    }

    @ApiOperation({ operationId: 'loginUser' })
    @Post('/login')
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Login the user created and returns a token.'
    })
    login(@Body() request: UserDto){
        return this.authService.loginUser(request);
    }
}