import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from 'src/auth/dtos/Login.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ){}
    async validateUser(username: string, password: string){
        const existingUser = await this.userService.findOne(username);
        if (existingUser && (await compare(password, existingUser.password))) {
            const { password, ...rest } = existingUser;
            const jwtToken = this.jwtService.sign(rest);
            return {"statusCode":200,"message":"login success","data":rest, "jwt_token": jwtToken}
        }

        return null;
    }
}
