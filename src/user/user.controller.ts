import { Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { ApiBearerAuth, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { BaseResponseDto } from "src/model/dto/common/base-response.dto";
import { User } from "src/model/entities/user";

@Controller('users')
export class UserController{

    constructor(
        private readonly userService: UserService
    )
    {}

    @ApiOperation({description: 'Get all users'})
    @Get()
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.OK)
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Get all users'
    })
    getUsers(): Promise<BaseResponseDto<User[]>>{
        return this.userService.getUsers();
    }

    @ApiOperation({description: 'Delete user'})
    @Delete(':id')
    @UseGuards(AuthGuard)
    @ApiBearerAuth()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Delete user'
    })
    deleteUser(@Param('id', ParseIntPipe) id: number): Promise<void>{
        return this.userService.deleteUser(id);
    }
}