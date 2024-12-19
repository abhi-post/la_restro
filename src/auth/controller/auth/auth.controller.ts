import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../../dtos/Login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from '../../services/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Body() loginDto: LoginDto){
        return this.authService.validateUser(loginDto.mobile_no, loginDto.password);
    }

    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(){
        return "Testing";
    }
}
