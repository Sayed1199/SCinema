import {Body, Controller, Delete, HttpCode, HttpStatus, Patch, Post, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { BaseUser } from 'src/users/dto/base-user.dto';
import { Public } from './strategies/public-strategy';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { UpdateUsernameDto } from 'src/users/dto/update-username.dto';
import { ResetPasswordDto } from 'src/users/dto/reset-password.dto';

@Controller('auth')
@ApiTags("Auth")
export class AuthController {
    constructor(
        private authService: AuthService
    ){}

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    @ApiOperation({summary:"User Login"})
    @ApiBody({ type: LoginUserDto})
    @ApiResponse({
        status:200,
        description:"The record found", 
        type: LoginUserDto
    })
    async signIn(@Body() signInDto : LoginUserDto){
         return this.authService.signIn(signInDto.email,signInDto.password);    
    }


    @Public()
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth('access-token')
    @Post("logout") 
    @ApiOperation({summary:"User Logout"})
    @ApiResponse({
        status:200,
        description:"Logged out", 
    })

    async signOut(@Req() req){
      const token = this.extractTokenFromHeader(req)
         return await this.authService.signOut(req.user.id,token);    
    }


    @Public()
    @HttpCode(HttpStatus.CREATED)
    @Post("signup")
    @ApiOperation({ summary: "User Signup" })
    @ApiBody({ type: BaseUser})
    @ApiResponse({
        status: 201,
        description: "Registered Successfully",
        type: BaseUser,
    })
    signUp(@Body() signUpDto: CreateUserDto) {
        const payload = {
        username: signUpDto.username, 
        email: signUpDto.email,  
        password: signUpDto.password,
        createdAt: new Date()
        }
        return this.authService.signUp(payload);
  }

  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @Patch('update')
  @ApiOperation({ summary: "Username update" })
    @ApiBody({ type: UpdateUsernameDto})
    @ApiResponse({
        status: 201,
        description: "Updated Successfully",
        type: UpdateUsernameDto,
    })
  async updateUserName(@Body() updateUsernameDto : UpdateUsernameDto,@Req() req){
    return await this.authService.updateUserName(req.user.email,updateUsernameDto.username);
  }


  @HttpCode(HttpStatus.OK)
  @Patch('reset-password')
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: "Password reset" })
    @ApiBody({ type: ResetPasswordDto})
    @ApiResponse({
        status: 201,
        description: "Updated Successfully",
        type: ResetPasswordDto,
    })
  async resetPassword(@Body() resetPasswordDto : ResetPasswordDto,@Req() req){
    return await this.authService.resetPassword(req.user.email,resetPasswordDto.password);
  }


  private extractTokenFromHeader(request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
}

}
  