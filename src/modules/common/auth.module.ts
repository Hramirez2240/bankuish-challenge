import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthController } from "src/auth/auth.controller";
import { AuthService } from "src/auth/auth.service";
import { AuthGuard } from "src/auth/guards/auth.guard";
import configuration from "src/config/configuration";
import { Constants } from "src/config/constants";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "src/model/entities/user";
import { Repository } from "typeorm";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration]
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'db',
            port: 5432,
            username: 'postgres',
            password: 'postgres',
            database: 'postgres',
            entities: [User],
            autoLoadEntities: true,
            synchronize: true,
        }),
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService, 
        AuthGuard,
        Repository,
        {
            provide: 'CONSTANTS',
            useValue: Constants
        }
    ],
    exports: [AuthGuard, 'CONSTANTS', AuthService, TypeOrmModule, Repository]
})

export class AuthModule {}