import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from 'src/auth/dtos/Login.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { AuthService } from 'src/auth/services/auth/auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('login')
    @UseGuards(LocalAuthGuard)
    login(@Body() loginDto: LoginDto){
        return this.authService.validateUser(loginDto.username, loginDto.password);
    }

    @Get('/profile')
    @UseGuards(JwtAuthGuard)
    getProfile(){
        return "Testing";
    }
}
