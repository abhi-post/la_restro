import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Shop } from "./Shop.entity";
import { Table } from "./Table.entity";

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
    @JoinColumn({ name: 'fk_shop_id' })
    fk_shop_id: Shop;

    @OneToMany(() => Table, (table) => table.id)
    tables: Table[];

}
