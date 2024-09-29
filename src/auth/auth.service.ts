import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PersonalAccessTokens } from './jwt.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(PersonalAccessTokens) private readonly personalAccessTokenRepository : Repository<PersonalAccessTokens>,
        private usersService : UsersService,
        private jwtService : JwtService
    ){}

    async signIn(email:string,pass:string){
        try {
            const user = await this.usersService.findOneByEmail(email);
        if(!user){
            throw new UnauthorizedException();
        }
        const doesPasswordMatches = await bcrypt.compare(pass,user.password);
        if(!doesPasswordMatches){
            throw new UnauthorizedException();
        }
       
        const payload = {id:user.id,email:user.email}
        const {password,...remains} = user;
        var access_token = await this.jwtService.signAsync(payload);
        const newJwtRecord = this.personalAccessTokenRepository.create({
            userId: user.id,
            token: access_token,
            createdAt: new Date(),
            updatedAt: null
        })
        await this.personalAccessTokenRepository.save(newJwtRecord);
        return {
            access_token,
            user: remains
        }
        } catch (error) {
            throw new NotFoundException({message:"User not found"});
        }
        
    }

    async signOut(id:string,token:string){
        const dData = await this.personalAccessTokenRepository.findOne({where: {
            userId:id,
            token 
          }})
        await this.personalAccessTokenRepository.remove(dData);
        return{
            success: true,
            message: "Logged out successfully"
        }
    }

    async signUp(payload: CreateUserDto){
        console.log(payload)
        try {
            const user = await this.usersService.create(payload);
            return user;
        } catch (error) {
            throw new BadRequestException({message: error.detail??error}    )
        }
        
    }

    async updateUserName(email:string,username:string){
        return await this.usersService.updateUserName(email,username);
    }

    async resetPassword(email:string,password:string){
        return await this.usersService.resetUserPassword(email,password);
    }

}
