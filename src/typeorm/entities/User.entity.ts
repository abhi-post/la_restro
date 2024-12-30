import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shop } from "./Shop.entity";
import { Table } from "./Table.entity";
import { Menu } from "./Menu.entity";

@Entity({ name: 'users'})
export class User {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    enterprise_name: string;

    @Column({ type: 'bigint', unique: true })
    mobile_no: number;

    @Column({ nullable:true })
    email_id: string;

    @Column({ nullable:true, type: 'longtext'})
    shop_qr_code:string;

    @Column()
    password: string;

    @Column({ nullable:true })
    auth_strategy: string;

    @Column({ default: false })
    is_mobile_verfied: boolean;

    @Column({ default: false })
    is_email_verified: boolean;

    @Column({ nullable:true })
    otp: string;

    @Column({ nullable:true })
    session_id: string;

    @OneToOne( () => Shop, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE', eager: true
    } )
    @JoinColumn({ name: 'fk_shop_id' })
    fk_shop_id: Shop;

    @OneToMany(() => Table, (table) => table.id)
    tables: Table[];

    @OneToMany(() => Menu, (menu) => menu.id)
    menus: Menu[];

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;

}
