import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { PersonalAccessTokens } from 'src/auth/jwt.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) private userRepository : Repository<UserEntity>,
        @InjectRepository(PersonalAccessTokens) private readonly jwtTokenRepository : Repository<PersonalAccessTokens>,
    ){}

    async findOneByEmail(email: string): Promise<UserEntity | undefined> {
        return await this.userRepository.findOneBy({ email });
    }

    async create(createUserDto: CreateUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password,10)
        createUserDto.password = hashedPassword
        const user = this.userRepository.create({
            ...createUserDto,
            createdAt: new Date(),
        });
        await this.userRepository.save(user)
        const {password,...remains} = user;
        return remains;
    }
     
    async updateUserName(email:string,newUserName:string) : Promise<UserEntity | undefined>{
        try {
            if(newUserName === undefined){
                throw new BadRequestException({message: "username is required"})
            }
            const user = await this.findOneByEmail(email)
            if(!user){
                throw new NotFoundException({message:"This user does not exist."});
            }
    
            const {id,username,...others} = user;
    
            const newUser = await this.userRepository.save({
                id: user.id,
                username: newUserName,
                ...others
            })
    
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException({message: error.detail ?? error})
        }
    }

    async resetUserPassword(email:string,newPassword:string) : Promise<UserEntity | undefined>{

        try {
            if(newPassword === undefined){
                throw new BadRequestException({message: "password is required"})
            }
            const user = await this.findOneByEmail(email)
            if(!user){
                throw new NotFoundException({message:"This user does not exist."});
            }
    
            const {id,password,...others} = user;
    
            const newUser = await this.userRepository.save({
                id: user.id,
                username: newPassword,
                ...others
            })
    
            return newUser;
        } catch (error) {
            throw new InternalServerErrorException({message: error.detail ?? error})
        }


    }

    async findUserByEmailAndToken(email:string,token:string):Promise<boolean>{
        const user = await this.userRepository.findOne(
            {
                where:{
                    email:email
                }
            }
        )
        if(!user){
            return false;
        }
        const userID = user.id;
        const jwtData = await this.jwtTokenRepository.findOne({
            where:{
                userId: userID,
                token
            }
        })
        if(!jwtData){
            return false;
        }
        return true;

    }

}
 