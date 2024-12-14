import { Inject, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from 'passport-jwt'
import { JWT_SECRET } from "src/config/constants";
import { UsersService } from "src/users/services/users/users.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(UsersService) private userService: UsersService,@Inject(ConfigService) private config: ConfigService) {
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          ignoreExpiration: false,
          secretOrKey: config.get<string>(JWT_SECRET),
        });
      }
    
      async validate(payload: any) {
        // console.log(payload);
        const { sub: id } = payload;
        const user = await this.userService.getOne(id);
        return user;
      }
}