import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User.entity";
import { Category } from "./Category.entity";

@Entity({ name: 'enterprise_menu'})
export class Menu{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('decimal', { precision: 6, scale: 2 })
    price: number;

    @Column('decimal', { precision: 6, scale: 2 })
    selling_price: number;

    @Column()
    type_of_food: string;

    @Column({ nullable: true })
    no_of_product: number;

    @Column("json")
    taxes: Record<string, any>;

    @Column({ default: true })
    is_active: boolean;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'fk_user_id' })
    fk_user_id: User;

    @ManyToOne(() => Category, (category) => category.id)
    @JoinColumn({ name: 'fk_category_id' })
    fk_category_id: Category;

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;
    
}
