import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/services/users/users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try{
      const request = context.switchToHttp().getRequest();
      const authHeader = request.headers.authorization;

      if (!authHeader) {
        throw new UnauthorizedException('Authorization header missing');
      }
      const token = authHeader.split(' ')[1];
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findOne(payload.mobile_no);

      if (!user || user.session_id !== payload.session_id) {
        throw new UnauthorizedException('Session invalid or expired');
      }

      request.user = user;
      return true;
    }catch(error){
      if(error.response != undefined){
        throw new UnauthorizedException(error.response.message);
      }else{
        throw new UnauthorizedException("JWT Expired");
      }
    }
  }
}
