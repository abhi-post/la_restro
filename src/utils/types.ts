export type CreateUserParams = {
    mobile_no: number;
    enterprise_name: string;
    password: string;
}

export type UpdateUserParams = {
    mobile_no: number;
    password: string;
}

export type CreateShopParams = {
    shop_name: string;
    mobile_no: number;
    email_id: string;
    title_name: string;
}
