import { Module } from '@nestjs/common';
import { AppDatasourcesModule } from './database/datasources'
import { JwtModule } from '@nestjs/jwt';
import { env } from './config'
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersModules } from './providers'
import { AppModules } from './modules';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './modules/auth/auth.guard';

@Module({
  imports: [
    AppDatasourcesModule,
    TypeOrmModule.forFeature([]),
    JwtModule.register({
      global: true,
      secret: env.security.jwt.secret,
      signOptions: { expiresIn: `${env.security.jwt.expiration}m` },
    }),
    ...ProvidersModules,
    ...AppModules,
  ],
  controllers: [],
  providers: [
    AuthGuard,
    {
      provide: APP_GUARD,
      useExisting: AuthGuard,
    }
  ],
})
export class AppModule {}
