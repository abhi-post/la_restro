import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./User.entity";

@Entity({ name: 'enterprise_table'})
export class Table{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({ name: 'fk_user_id' })
    fk_user_id: User;
}
