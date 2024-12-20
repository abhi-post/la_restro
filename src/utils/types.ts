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
    email_id: string;
    title_name: string;
}

export type CreateTableParams = {
    name: string;
    description: string;
    fk_user_id: number;
}

export type UpdateTableParams = {
    name: string;
    description: string;
    fk_user_id: number;
}