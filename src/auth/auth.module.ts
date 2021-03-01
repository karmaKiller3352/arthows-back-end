import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { UserModule } from '../users/user.module';
import { JwtStrategy } from './auth.strategy';
import { RolesGuard, JwtAuthGuard } from './auth.guards';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configServise: ConfigService) => ({
        secret: configServise.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configServise.get('JWT_REFRESH_TOKEN_EXPIRES'),
        },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
  controllers: [],
})
export class AuthModule {}
