import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../database/entities/user'
import { HashModule } from '../../providers/hash/hash.module';
import { UserService } from './users.service';
import { UserController } from './users.controller';
import { LogModule } from '../../providers/log/log.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule, LogModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
