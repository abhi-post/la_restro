import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'enterprise_details'})
export class Shop{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column({ nullable:true })
    title_name: string;

    @Column({ nullable:true })
    email_id: string;

    @Column({ type: 'bigint', unique: true })
    mobile_no: number;

    @Column({ nullable:true })
    gstin: string;

    @Column({ nullable:true })
    trademark_name: string;

    @Column({ default: false })
    is_mobile_verfied: boolean;

    @Column({ default: false })
    is_email_verified: boolean;

    @Column({ type: 'longtext'})
    shop_qr_code:string;

    @Column({ type: 'date'})
    created_date: Date;

    @Column({ type: 'time'})
    created_time: Date;
}
