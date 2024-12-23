import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from '../../dtos/Login.dto';
import { UsersService } from '../../../users/services/users/users.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ){}
    async validateUser(mobile_no: number, password: string){
        const existingUser = await this.userService.findOne(mobile_no);
        if (existingUser && (await compare(password, existingUser.password))) {
            const { password, ...rest } = existingUser;
            const jwtToken = this.jwtService.sign(rest);
            return {statusCode:200,message:"login success",data:rest, "jwt_token": jwtToken}
        }

        return null;
    }
}
