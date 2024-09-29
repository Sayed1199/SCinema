import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { PersonalAccessTokens } from 'src/auth/jwt.entity';

@Module({
  providers: [UsersService],
  exports: [UsersService],
  imports: [
    TypeOrmModule.forFeature([UserEntity,PersonalAccessTokens])
  ]
})
export class UsersModule {}
