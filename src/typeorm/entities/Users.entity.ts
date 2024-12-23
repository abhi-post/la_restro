import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shop } from "./Shop.entity";

@Entity({ name: 'users'})
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    enterprise_name: string;

    @Column({ type: 'bigint', unique: true })
    mobile_no: number;

    @Column()
    password: string;

    @Column({ nullable:true })
    auth_strategy: string;

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;

    @OneToOne( () => Shop )
    @JoinColumn()
    shop: Shop;


}
