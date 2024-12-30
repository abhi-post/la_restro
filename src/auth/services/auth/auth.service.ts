import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from '../../dtos/Login.dto';
import { UsersService } from '../../../users/services/users/users.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from '../../dtos/ResetPassword.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserParams } from '../../../utils/types';
import { VerifyOtpDto } from '../../dtos/VerifyOtp.dto';
import { RefreshTokenDto } from '../../dtos/RefreshToken.dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private jwtService: JwtService
    ) { }

    async createUser(userDetails: CreateUserParams) {
        try {
            const existingMobile = await this.userService.findOne(userDetails.mobile_no);
            const existingEmail = await this.userService.findOneByEmail(userDetails.email_id);

            if (existingMobile) {
                throw new ConflictException({ message: "Mobile number already exist" });
            }

            if (existingEmail) {
                throw new ConflictException({ message: "Email already exist" });
            }

            const userPassword = userDetails.password;
            const encPassword = await bcrypt.hash(userPassword, 10);
            userDetails.password = encPassword;
            const saveUser = await this.userService.saveUser(userDetails);
            const existingUser = await this.userService.findOne(userDetails.mobile_no);
            if (existingUser) {
                // Generate new session ID 
                const newSessionId = this.generateSessionId();
                existingUser.session_id = newSessionId;
                const updatedUser = await this.userService.commonSaveUser(existingUser);
                const { password, shop_qr_code, ...rest } = existingUser;
                const jwtToken = this.jwtService.sign(rest, { expiresIn: '30m' });
                const refreshToken = this.jwtService.sign(rest, { expiresIn: '7d' });
                return { statusCode: 200, message: "User Successfully Registered", data: rest, jwt_token: jwtToken, refresh_token: refreshToken }
            }
        } catch (error) {
            console.log(error);
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }

            if (error.name == "ConflictException") {
                throw new ConflictException(error.response.message);
            }

            throw new ServiceUnavailableException();
        }
    }


    async validateUser(mobile_no: number, password: string) {
        const existingUser = await this.userService.findOne(mobile_no);
        if (existingUser && (await compare(password, existingUser.password))) {
            // Generate new session ID 
            const newSessionId = this.generateSessionId();
            existingUser.session_id = newSessionId;
            const updatedUser = await this.userService.commonSaveUser(existingUser);
            const { password, shop_qr_code, ...rest } = existingUser;
            const refreshToken = this.jwtService.sign(rest, { expiresIn: '7d' });
            const jwtToken = this.jwtService.sign(rest, { expiresIn: '30m' });
            return { statusCode: 200, message: "login success", data: rest, jwt_token: jwtToken, refresh_token: refreshToken }
        } else {
            throw new UnauthorizedException('Login user or password does not match.');
        }
    }

    async forgotPassword(mobile_no: number) {
        try {
            const user = await this.userService.findOne(mobile_no);
            if (!user) {
                throw new NotFoundException({ message: "User Not Found, Please enter registered mobile number" });
            }
            const otp = (crypto.randomInt(1000, 10000)).toString();
            user.otp = otp;
            const updatedUser = await this.userService.commonSaveUser(user);
            const message = `OTP to reset your password: ${otp}`;
            // this.mailService.sendMail({
            //     from: 'La-Restra Support <support@larestra.store>',
            //     to: 'abhaytech1995@gmail.com',
            //     subject: `Reset Password (la restro)`,
            //     text: message,
            // });
            return { statusCode: 200, message: "Otp send to your register email id and mobile no", data: message }
        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }
            if (error.name == "NotFoundException") {
                throw new NotFoundException(error.response.message);
            }
        }
    }

    async verifyOtp(verifyOtpDetails: VerifyOtpDto) {
        const user = await this.userService.findOne(verifyOtpDetails.mobile_no);
        if (!user) {
            throw new NotFoundException({ message: "User Not Found, You can't verify otp" });
        }

        const savedOtp: number = parseInt(user.otp);

        if (savedOtp === verifyOtpDetails.otp) {
            user.otp = "";
            await this.userService.commonSaveUser(user);
            return { statusCode: 200, message: 'OTP Verified Successfully', data: "" };
        } else {
            return { statusCode: 200, message: 'Wrong OTP', data: "" };
        }
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<any> {
        try {

            const user = await this.userService.findOne(resetPasswordDto.mobile_no);

            if (!user) {
                throw new NotFoundException({ message: "User Not Found, Can't forgot password" });
            }

            const hashedPassword = await bcrypt.hash(resetPasswordDto.password, 10);
            user.password = hashedPassword;
            const updatedUser = await this.userService.commonSaveUser(user);
            return { message: 'Password reset successfully' };

        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    private generateSessionId(): string {
        const id = crypto.randomBytes(16).toString("hex");
        return id;
    }

    // Refresh Token
    async refreshToken(refreshToken: RefreshTokenDto) {
        try { 
            const payload = this.jwtService.verify(refreshToken.refresh_token);
            console.log(payload);
            const user = await this.userService.findOne(payload.mobile_no);

            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            const { password, shop_qr_code, ...rest } = user;
            const newAccessToken = this.jwtService.sign(rest, { expiresIn: '30m' });
            return { accessToken: newAccessToken };
        } catch (error) {
            console.log(error);
            throw new UnauthorizedException('Invalid refresh token');
        }
    }
}
