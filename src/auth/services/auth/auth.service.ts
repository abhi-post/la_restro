import { BadRequestException, ConflictException, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { LoginDto } from '../../dtos/Login.dto';
import { UsersService } from '../../../users/services/users/users.service';
import * as crypto from 'crypto';
import { ResetPasswordDto } from 'src/auth/dtos/ResetPassword.dto';
import * as bcrypt from 'bcrypt';
import { CreateUserParams } from '../../../utils/types';
import { VerifyOtpDto } from 'src/auth/dtos/VerifyOtp.dto';

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
            const { password,shop_qr_code, ...rest } = saveUser;
            const jwtToken = this.jwtService.sign(rest);
            return { statusCode: 200, message: "User Successfully Registered", data: rest, "jwt_token": jwtToken }
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
            const { password, shop_qr_code, ...rest } = existingUser;
            const jwtToken = this.jwtService.sign(rest);
            return { statusCode: 200, message: "login success", data: rest, "jwt_token": jwtToken }
        }

        return null;
    }

    async forgotPassword(mobile_no: number) {
        try {
            const user = await this.userService.findOne(mobile_no);
            if (!user) {
                throw new NotFoundException({ message: "User Not Found, Please enter registered mobile number" });
            }
            const otp = (crypto.randomInt(1000, 10000)).toString();
            user.otp = otp;
            const updatedUser = await this.userService.resetPassword(user);
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

    async verifyOtp(verifyOtpDetails: VerifyOtpDto){
        const user = await this.userService.findOne(verifyOtpDetails.mobile_no);
        if (!user) {
            throw new NotFoundException({ message: "User Not Found, You can't verify otp" });
        }

        const savedOtp: number = parseInt(user.otp);

        if(savedOtp === verifyOtpDetails.otp){
            user.otp = "";
            await this.userService.resetPassword(user);
            return { statusCode: 200, message: 'OTP Verified Successfully', data: "" };
        }else{
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
            const updatedUser = await this.userService.resetPassword(user);
            return { message: 'Password reset successfully' };

        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }
}
