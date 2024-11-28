import { Module } from "@nestjs/common";
import { AuthModule } from "./common/auth.module";
import { UserController } from "src/user/user.controller";
import { UserService } from "src/user/user.service";

@Module({
    imports: [AuthModule],
    providers: [UserService],
    controllers: [UserController]
})

export class UserModule {}