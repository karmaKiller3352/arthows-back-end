import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';

import { JwtStrategy } from './auth.strategy';
import { RolesGuard, JwtAuthGuard } from './auth.guards';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServise: ConfigService) => ({
        secret: configServise.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configServise.get('JWT_ACCESS_TOKEN_EXPIRES'),
        },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
