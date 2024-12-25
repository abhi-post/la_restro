import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { LoginDto } from '../../dtos/Login.dto';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../guards/local-auth.guard';
import { AuthService } from '../../services/auth/auth.service';
import { ForgotPasswordDto } from '../../dtos/ForgotPassword.dto';
import { ResetPasswordDto } from '../../dtos/ResetPassword.dto';
import { CreateUserDto } from '../../dtos/CreateUser.dto';
import { VerifyOtpDto } from '../../dtos/VerifyOtp.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

    @Post('/create-user')
    createUser(@Body() CreateUserDto: CreateUserDto){
        return this.authService.createUser(CreateUserDto);  
    }

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

    @Post('/send-otp')
    forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto){
        return this.authService.forgotPassword(forgotPasswordDto.mobile_no);  
    }

    @Post('/verify-otp')
    verifyOTP(@Body() verifyOtpDto: VerifyOtpDto){
        return this.authService.verifyOtp(verifyOtpDto);  
    }

    @Post('/reset-password')
    resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
