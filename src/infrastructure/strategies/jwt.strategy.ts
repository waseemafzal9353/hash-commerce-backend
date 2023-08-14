import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from 'src/auth/auth.service';
import { UserInterface, jwtPayloadInterface } from '../interfaces/utility.interface';
import { BusinessException } from '../Exceptions/business.exception';
import { Role } from '../enums/gloabal.enum';

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
    let user: UserInterface

    if(!payload.hasOwnProperty('roles')){
      user = await this.authService.getUserByEmail(sub)
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

    const executiveRoles: Role[] = []
    user.role === Role.Admin ? executiveRoles.push(Role.Admin) : executiveRoles.push(Role.SuperAdmin)  
    payload.roles = executiveRoles
    return  user;
  }
}