import { BadRequestException, HttpStatus, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserDto } from "../model/dto/user.dto";
import * as firebaseAdmin from 'firebase-admin';
import { RegisterUserDto } from "../model/dto/register-user.dto";
import { UserLogedInDto } from "../model/dto/user-loged-in.dto";
import { ConfigService } from "@nestjs/config";
import axios, { AxiosError, AxiosResponse } from "axios";
import { BaseResponseDto } from "../model/dto/common/base-response.dto";
import { Constants } from "../config/constants";
import { RegisterUserResponseDto } from "../model/dto/register-user-response.dto";
import { Repository } from "typeorm";
import { User } from "../model/entities/user";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class AuthService{

    constructor(
        private readonly configService: ConfigService,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject('CONSTANTS') private readonly constants: typeof Constants
    )
    {}

    async registerUser(request: RegisterUserDto): Promise<BaseResponseDto<RegisterUserResponseDto>>{
        try{
            const user = await firebaseAdmin.auth().createUser({
                email: request.email,
                password: request.password
            });

            await this.userRepository.save({email: user.email});

            return {
                statusCode: HttpStatus.OK,
                data: {email: user.email},
                message: this.constants.responseMessage.USER_REGISTRATION_SUCCESSFULLY
            };
        } catch(error){
            console.log(error);
            throw new Error(this.constants.responseMessage.USER_REGISTRATION_FAILED);
        }
    }

    async loginUser(request: UserDto): Promise<BaseResponseDto<UserLogedInDto>>{
        try{
            const { idToken, refreshToken, expiresIn } = await this.signInWithEmailAndPassword(request);
            return {
                statusCode: HttpStatus.OK,
                data: {
                    idToken,
                    refreshToken,
                    expiresIn
                },
                message: this.constants.responseMessage.USER_LOGGED_IN_SUCCESSFULLY
            };
        } catch(error){
            if(error.message.includes(HttpStatus.BAD_REQUEST.toString())){
                throw new BadRequestException(this.constants.responseMessage.USER_OR_PASSWORD_INVALID);
            } else{
                throw new InternalServerErrorException(error.message);
            }
        }
    }

    private async signInWithEmailAndPassword(request: UserDto){
        const url = `${this.configService.get('firebaseConfig.pathBase')}${this.configService.get('firebaseConfig.pathSignIn')}?key=${this.configService.get('firebaseConfig.apiKey')}`;
        const data = {
            email: request.email,
            password: request.password,
            returnSecureToken: true
        };

        return await axios
            .request({
                url: url,
                method: 'POST',
                data,
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then((response: AxiosResponse) => response.data)
            .catch((error: AxiosError) => {
                throw new BadRequestException(error);
            })
            .catch((error) => {
                throw new Error(error.message);
            });
    }

    async validateRequest(req): Promise<boolean> {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
          console.log('Authorization header not provided.');
          return false;
        }
        const [bearer, token] = authHeader.split(' ');
        if (bearer !== 'Bearer' || !token) {
          console.log('Invalid authorization format. Expected "Bearer <token>".');
          return false;
        }
        try {
          const decodedToken = await firebaseAdmin.auth().verifyIdToken(token);
          console.log('Decoded Token:', decodedToken);
          return true;
        } catch (error) {
          if (error.code === 'auth/id-token-expired') {
            console.error('Token has expired.');
          } else if (error.code === 'auth/invalid-id-token') {
            console.error('Invalid ID token provided.');
          } else {
            console.error('Error verifying token:', error);
          }
          return false;
        }
      }
}