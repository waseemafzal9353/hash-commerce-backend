import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { jwtPayloadInterface } from '../interfaces/utility.interface';
import { BusinessException } from '../Exceptions/business.exception';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  
  constructor(private configService: ConfigService, private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>("JWT_SECRET_KEY"),
    });
  }

  async validate(payload: jwtPayloadInterface) {    
    const {sub} = payload    
    const user = await this.authService.getUserByEmail(sub)
              if(!user){
                throw new BusinessException(
                  'users',
                  'you are unauthorized to access this route.',
                  'User unauthorized',
                  HttpStatus.UNAUTHORIZED,
              );
              }
    return  user;
  }
}