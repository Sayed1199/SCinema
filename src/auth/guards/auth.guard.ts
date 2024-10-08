import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { IS_PUBLIC_KEY } from "../strategies/public-strategy";
import { UsersService } from '../../users/users.service';

@Injectable()
export class AuthGuard implements CanActivate{
 
    constructor(
        private jwtService: JwtService,
        private reflector : Reflector,
        private usersService : UsersService,
    ){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY,[ context.getHandler(),context.getClass(),]);
        console.log(isPublic)
        if(isPublic){
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException(); 
        }
        try {
            const payload = await this.jwtService.verifyAsync(token, {secret: process.env.JWT_SECRET_KEY});
            request.user = payload;

            var foundUser:boolean = await this.usersService.findUserByEmailAndToken(request.user.email,token);
            if(!foundUser){ 
                throw new UnauthorizedException(); 
            }
            
        } catch (error) {
            throw new UnauthorizedException();
        }
        return true;
    }

    private extractTokenFromHeader(request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }

}  