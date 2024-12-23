import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Menu } from "./Menu.entity";

@Entity({ name: 'menu_categories'})
export class Category{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column({ nullable:true })
    description?: string;

    @Column({ default: true })
    is_active: boolean;

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;

    @OneToMany(() => Menu, (menu) => menu.id)
    menus: Menu[];
}