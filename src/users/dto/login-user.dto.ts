import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginUserDto{
    @ApiProperty(
        {
          required:true,
          example:"sayed@gmail.com"
        }
      )
      @IsEmail()
      email: string;
    
      @ApiProperty(
        {
          required:true,
          example:"Test@_12345"
        }
      )
      @IsStrongPassword()
      password: string;
}