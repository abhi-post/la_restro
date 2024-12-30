import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: 'user_tokens'})
export class Token{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    fcm_device_token: string;

    @OneToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'fk_user_id' })
    fk_user_id: User;
    
}
