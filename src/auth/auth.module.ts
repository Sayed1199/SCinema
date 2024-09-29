import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { PersonalAccessTokens } from './jwt.entity';

@Module({
  imports:[
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserEntity,PersonalAccessTokens]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard
    }
    ,
    AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
