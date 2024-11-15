import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { HashModule } from '../../providers/hash/hash.module';
import { AppJwtModule } from '../../providers/jwt/jwt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user';

@Module({
  imports: [HashModule, AppJwtModule, TypeOrmModule.forFeature([User])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
