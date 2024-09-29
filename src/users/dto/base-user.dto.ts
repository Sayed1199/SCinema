import { ApiProperty } from '@nestjs/swagger';
import { IsAlpha, IsEmail, IsNotEmpty, IsStrongPassword } from 'class-validator';
export class BaseUser {
  @ApiProperty(
    {
      required:true,
      example:"sayed"
    }
  )
  @IsAlpha()
  username?: string;

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