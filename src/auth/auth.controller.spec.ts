import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common"
import { AuthService } from "../auth/auth.service";
import { mock, mockReset } from "jest-mock-extended";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigModule } from "@nestjs/config";
import * as request from "supertest";
import { RegisterUserDto } from "../model/dto/register-user.dto";
import { RegisterUserResponseDto } from "../model/dto/register-user-response.dto";
import { BaseResponseDto } from "../model/dto/common/base-response.dto";
import { Constants } from "../config/constants";
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
    let app: INestApplication;
    let service: AuthService;

    const registerUserDto: RegisterUserDto = {
      email: 'GKl3e@example.com',
      password: 'test-password',
      displayName: 'test-display-name'  
    };

    const registerUserResponseDto: BaseResponseDto<RegisterUserResponseDto> = {
        statusCode: HttpStatus.OK,
        data: {email: 'GKl3e@example.com'},
        message: Constants.responseMessage.USER_REGISTRATION_SUCCESSFULLY
    };

    const mockService = mock<AuthService>();
    const mockRepository = () => ({
        find: jest.fn(),
        findOne: jest.fn(),
        save: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
      });

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot()],
        })
        .overrideProvider(AuthService).useValue(mockService)
        // .overrideProvider(getRepositoryToken(User)).useValue(mockRepository())
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
        service = module.get<AuthService>(AuthService);
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

    describe('registerUser', () => {
        it('should register user successfully', async () => {
            const response = await request(app.getHttpServer)
            .post('/api/auth/register')
            .set('Content-Type', 'application/json')
            .send(registerUserDto)
            .expect(HttpStatus.OK);

            expect(response.body.data).not.toBeNull();
            expect(response.body.data).toEqual(registerUserResponseDto.data);
        })
    })
})