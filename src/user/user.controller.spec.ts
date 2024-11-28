import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "../modules/common/auth.module";
import { mock, mockReset } from "jest-mock-extended";
import * as request from "supertest";
import { BaseResponseDto } from "../model/dto/common/base-response.dto";
import { User } from "../model/entities/user";
import { Constants } from "../config/constants";

describe('UserController', () => {
    let app: INestApplication;
    let service: UserService;

    const getUsersExpectedResponse: BaseResponseDto<User[]> = {
        statusCode: HttpStatus.OK,
        data: [
            {
                email: 'GKl3e@example.com',
                id: 1
            }
        ],
        message: Constants.responseMessage.GENERIC_SUCCESS
    }

    const mockService = mock<UserService>();

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [AuthModule],
        })
        .overrideProvider(UserService).useValue(mockService)
        .compile();

        app = module.createNestApplication();
        app.useGlobalPipes(
            new ValidationPipe({
                transform: true,
                whitelist: true,
                forbidNonWhitelisted: true,
                transformOptions: {
                    enableImplicitConversion: true
                }
            })
        );
        await app.init();
        service = module.get<UserService>(UserService);
    });

    beforeEach(() => {
        mockReset(mockService);
    });

    afterAll(async () => {
        await app.close();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getUsers', () => {
        it('should retrieve user list successfully', async () => {
            const response = await request(app.getHttpServer)
            .get('/api/users')
            .set('Content-Type', 'application/json')
            .expect(HttpStatus.OK);

            expect(response.body.data).not.toBeNull();
            expect(response.body.data).toEqual(getUsersExpectedResponse.data);
        })
    })
})