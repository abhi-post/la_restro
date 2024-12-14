import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateShopParams, CreateUserParams, UpdateUserParams } from 'src/utils/types';
import { EntityManager, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import * as QrCode from 'qrcode';
import * as sharp from 'sharp';
import { User } from 'src/typeorm/entities/Users.entity';
import { Shop } from 'src/typeorm/entities/Shop.entity';
import { join } from 'path'

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Shop) private shopRepository: Repository<Shop>
    ){}

    async findUser(){
        try{
            const users = await this.userRepository.find({ relations: ['shop']});
            return {"statusCode":200,"message":"data found","data":users}
        }catch(error){
            console.log(error)
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async createUser(userDetails: CreateUserParams){
        try{
            const existingUser = await this.userRepository.findOne({
                where:{username: userDetails.username}
            });
            
            if(existingUser){
                throw new ConflictException();
            }

            const userPassword = userDetails.password;
            const encPassword = await bcrypt.hash(userPassword, 10);
            userDetails.password = encPassword;
            const newUser =  this.userRepository.create({...userDetails, created_date: new Date(), created_time: new Date()});
            return this.userRepository.save(newUser);
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "ConflictException"){
                throw new ConflictException("Username already exist");
            }
            
            throw new ServiceUnavailableException();
        }
    }

    async updateUser(id: number, updateuserDetails: UpdateUserParams){
        try{
            const updatedUser = await this.userRepository.update({ id }, { ...updateuserDetails })
            return {"statusCode":200,"message":"User Updated","data":""}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async deleteUser(id: number){
        try{
            await this.userRepository.delete({ id })
            return {"statusCode":200,"message":"User Deleted","data":""}
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }
            throw new ServiceUnavailableException();
        }
    }

    async createShop(id: number, shopDetails: CreateShopParams){
        try{
            /* Generate Qr Code for shop */
            const data = 'https://example.com'; // The data to encode in the QR code
            const logoPath = join(__dirname, '../../../../src/utils/logo.png') // Path to your logo
            const base64String =  await this.generateQrWithLogoBase64(data, logoPath);
            /* Generate Qr Code for shop */
            const user =  await this.userRepository.findOneBy({ id });
            if(!user){
                throw new NotFoundException();
            }

            const existingMobile = await this.shopRepository.findOne({
                where:{mobile_no: shopDetails.mobile_no}
            });
            
            if(existingMobile){
                throw new ConflictException();
            }

            const newShop =  this.shopRepository.create({...shopDetails, shop_qr_code: base64String, created_date: new Date(), created_time: new Date()});
            const savedShop = await this.shopRepository.save(newShop);
            user.shop = savedShop;
            return this.userRepository.save(user);
        }catch(error){
            if(error.name == "ValidationError"){
                throw new BadRequestException(error.errors);
            }

            if(error.name == "NotFoundException"){
                throw new NotFoundException('User not found, cannot create shop');
            }

            if(error.name == "ConflictException"){
                throw new ConflictException("Mobile already exist");
            }

            throw new ServiceUnavailableException();
        }
    }

    async findOne(username: string){
        try{
            const existingUser = await this.userRepository.findOne({
                where:{username: username}
            });
            return existingUser;
        }catch(error){
            if(error.name == "ValidationError"){
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

    // Function to generate QR code with logo and return base64 string
    async generateQrWithLogoBase64(data: string, logoPath: string) {
        try {
        // Step 1: Generate QR Code as a Buffer
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
  
            // Step 2: Load the QR code image buffer and logo image
            const qrImage = sharp(qrCodeBuffer);
            const logoImage = await sharp(logoPath).resize(100).toBuffer(); // Resize logo
        
            // Step 3: Get QR code metadata to determine its size
            const { width, height } = await qrImage.metadata();
        
            // Step 4: Calculate logo position (centered)
            const logoSize = 100; // Size of the logo (100x100 px)
            const logoPosition = {
                left: Math.floor((width - logoSize) / 2),
                top: Math.floor((height - logoSize) / 2)
            };
        
            // Step 5: Overlay the logo onto the QR code image
            const outputBuffer = await qrImage
                .composite([
                {
                    input: logoImage,
                    top: logoPosition.top,
                    left: logoPosition.left,
                }
                ])
                .toBuffer();
        
            // Step 6: Convert the resulting image to a Base64 string
            const base64Image = outputBuffer.toString('base64');
            const base64DataUri = `data:image/png;base64,${base64Image}`;
            return base64DataUri;
        } catch (err) {
            console.error('Error generating QR code with logo:', err);
            throw err;
        }
    }
}
