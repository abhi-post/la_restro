import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShopParams, CreateTokenParams, CreateUserParams, UpdateUserParams } from '../../../utils/types';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as QrCode from 'qrcode';
import * as sharp from 'sharp';
import { User } from '../../../typeorm/entities/User.entity';
import { Shop } from '../../../typeorm/entities/Shop.entity';
import { join } from 'path';
import { Token } from '../../../typeorm/entities/Token.entity';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Shop) private shopRepository: Repository<Shop>,
        @InjectRepository(Token) private tokenRepository: Repository<Token>
    ) { }

    async findUser() {
        try {
            const users = await this.userRepository.find({ relations: ['fk_shop_id'] });
            return { statusCode: 200, message: "data found", data: users }
        } catch (error) {
            console.log(error)
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async updateUser(id: number, updateuserDetails: UpdateUserParams) {
        try {
            const updatedUser = await this.userRepository.update({ id }, { ...updateuserDetails })
            return { statusCode: 200, message: "User Updated", data: "" }
        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async deleteUser(id: number) {
        try {
            await this.userRepository.delete({ id })
            return { statusCode: 200, message: "User Deleted", data: "" }
        } catch (error) {
            console.log(error);
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async createShop(id: number, shopDetails: CreateShopParams) {
        try {
            const user = await this.userRepository.findOneBy({ id });
            if (!user) {
                throw new NotFoundException();
            }

            const newShop = this.shopRepository.create({ ...shopDetails, created_date: new Date(), created_time: new Date() });
            const savedShop = await this.shopRepository.save(newShop);
            user.fk_shop_id = savedShop;
            return this.userRepository.save(user);
        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }

            if (error.name == "NotFoundException") {
                throw new NotFoundException('User not found, cannot create shop');
            }

            if (error.name == "ConflictException") {
                throw new ConflictException("Mobile already exist");
            }

            throw new ServiceUnavailableException();
        }
    }

    async findOne(mobile_no: number) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { mobile_no: mobile_no }
            });
            return existingUser;
        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }

            throw new ServiceUnavailableException();
        }
    }

    async findOneByEmail(email_id: string) {
        try {
            const existingUser = await this.userRepository.findOne({
                where: { email_id: email_id }
            });
            return existingUser;
        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }

            throw new ServiceUnavailableException();
        }
    }

    async getOne(id: number) {
        const user = await this.userRepository.findOneBy({ id })
        if (!user)
            throw new NotFoundException('User does not exists or unauthorized');

        return user;
    }

    async saveUser(userDetails: any) {
        /* Generate Qr Code for shop */
        const data = 'https://example.com'; // The data to encode in the QR code
        const logoPath = join(__dirname, '../../../../src/utils/logo.png') // Path to your logo
        const base64String = await this.generateQrWithLogoBase64(data, logoPath);
        /* Generate Qr Code for shop */

        const newUser = this.userRepository.create({ 
            ...userDetails, 
            shop_qr_code: base64String,
            created_date: new Date(),
            created_time: new Date()
        });

        const savedUser = await this.userRepository.save(newUser);
        const existingUser = await this.userRepository.findOne({
            where: { 
                email_id: userDetails.email_id
            }
        });
        return existingUser;

    }

    async commonSaveUser(userDetails: any) {
        const updatedUser = this.userRepository.create({ ...userDetails });
        return this.userRepository.save(updatedUser);
    }

    async saveToken(tokenDetails: CreateTokenParams){
        try{
            const user = await this.userRepository.findOne({ where: { 
                id: tokenDetails.fk_user_id ,
            }});
            if (!user) {
                throw new NotFoundException({message: 'User does not exists or unauthorized'});
            }

            const token = await this.tokenRepository.findOne({ 
                where: { 
                    fk_user_id: {id: tokenDetails.fk_user_id} ,
                    fcm_device_token: tokenDetails.fcm_device_token
                },
                relations: ['fk_user_id']
            });
            
            if (token) {
                throw new ConflictException({message: "Token Already Exist"});
            }else{
                const token = await this.tokenRepository.findOne({ 
                    where: { 
                        fk_user_id: {id: tokenDetails.fk_user_id}
                    }
                });
                
                if(token && token.fcm_device_token != tokenDetails.fcm_device_token){
                    const updatedItem = this.tokenRepository.update(token.id, {
                        fcm_device_token: tokenDetails.fcm_device_token
                    });

                    return { statusCode: 200, message: "Token Updated", data: "" }
                }else{
                    const newToken = this.tokenRepository.create({ 
                        fcm_device_token: tokenDetails.fcm_device_token,
                        fk_user_id: user
                    });
            
                    return this.tokenRepository.save(newToken);
                }
            }


        } catch (error) {
            if (error.name == "ValidationError") {
                throw new BadRequestException(error.errors);
            }

            if (error.name == "NotFoundException") {
                throw new NotFoundException(error.response.message);
            }

            if (error.name == "ConflictException") {
                throw new ConflictException(error.response.message);
            }

            throw new ServiceUnavailableException();
        }
    }

    /* Function to generate QR code with logo and return base64 string start */
    async generateQrWithLogoBase64(data: string, logoPath: string) {
        try {
            /* Step 1: Generate QR Code as a Buffer */
            const qrCodeBuffer = await QrCode.toBuffer(data, {
                errorCorrectionLevel: 'H', // High error correction to tolerate logo insertion
                type: 'png',               // PNG format
                margin: 4,                 // QR code margin
                width: 600,                // Width of the QR code
                color: {
                    dark: '#000000',         // QR code color
                    light: '#ffffff'         // Background color
                }
            });

            /* Step 2: Load the QR code image buffer and logo image */
            const qrImage = sharp(qrCodeBuffer);
            const logoImage = await sharp(logoPath).resize(100).toBuffer(); // Resize logo

            /* Step 3: Get QR code metadata to determine its size */
            const { width, height } = await qrImage.metadata();

            /* Step 4: Calculate logo position (centered) */
            const logoSize = 100; // Size of the logo (100x100 px)
            const logoPosition = {
                left: Math.floor((width - logoSize) / 2),
                top: Math.floor((height - logoSize) / 2)
            };

            /* Step 5: Overlay the logo onto the QR code image */
            const outputBuffer = await qrImage
                .composite([
                    {
                        input: logoImage,
                        top: logoPosition.top,
                        left: logoPosition.left,
                    }
                ])
                .toBuffer();

            /* Step 6: Convert the resulting image to a Base64 string */
            const base64Image = outputBuffer.toString('base64');
            const base64DataUri = `data:image/png;base64,${base64Image}`;
            return base64DataUri;
        } catch (err) {
            console.error('Error generating QR code with logo:', err);
            throw err;
        }
    }
    /* Function to generate QR code with logo and return base64 string end */
}
