import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth/auth.service";
import { Inject, UnauthorizedException } from "@nestjs/common";

export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(@Inject(AuthService) private readonly authService: AuthService) {
        super({
          usernameField: 'username', // 'username'
          passwordField: 'password', // 'passport'
        });
    }

    async validate(username: string, password: string) {
        const user = await this.authService.validateUser(username, password);
        if (!user)
            throw new UnauthorizedException('Login user or password does not match.');
        return user;        
    }
}