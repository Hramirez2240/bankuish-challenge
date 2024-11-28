import { HttpStatus, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Constants } from "../config/constants";
import { BaseResponseDto } from "../model/dto/common/base-response.dto";
import { User } from "../model/entities/user";
import { Repository } from "typeorm";
import * as firebaseAdmin from 'firebase-admin';
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class UserService{
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @Inject('CONSTANTS') private readonly constants: typeof Constants
    ){}

    async getUsers(): Promise<BaseResponseDto<User[]>>{
        try{
            const users = await this.userRepository.find();
            return {
                statusCode: HttpStatus.OK,
                data: users,
                message: this.constants.responseMessage.GENERIC_SUCCESS
            }
        } catch(error){
            throw new Error(error.message);
        }
    }

    async createUser(email: string): Promise<boolean>{
        try{
            await this.userRepository.save({email});
            return true;
        } catch{
            return false;
        }
    }

    async deleteUser(id: number): Promise<void>{
        try{
            const user = await this.userRepository.findOne({where: {id: id}});
            if(!user) throw new NotFoundException(`${this.constants.responseMessage.USER_NOT_FOUND} with id ${id}`);

            const firebaseUser = await firebaseAdmin.auth().getUserByEmail(user.email);

            await firebaseAdmin.auth().deleteUser(firebaseUser.uid);
            await this.userRepository.delete(user);
        } catch(error){
            throw new Error(error.message);
        }
    }
}