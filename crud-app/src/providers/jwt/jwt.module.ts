import { Module } from '@nestjs/common';
import { AppJwtService } from './jwt.service';

@Module({
  providers: [AppJwtService],
  exports: [AppJwtService],
})
export class AppJwtModule {}
