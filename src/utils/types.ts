export type CreateUserParams = {
    mobile_no: number;
    email_id: string;
    enterprise_name: string;
    password: string;
}

export type UpdateUserParams = {
    mobile_no: number;
    password: string;
}

export type CreateShopParams = {
    title_name: string;
    shop_address: string;
    shop_logo: string;
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

export type CreateCategoryParams = {
    name: string;
    description?: string;
}

export type UpdateCategoryParams = {
    name: string;
    description?: string;
}

export type CreateMenuParams = {
    name: string;
    description: string;
    price: number;
    selling_price: number;
    type_of_food:string;
    no_of_product: number;
    fk_category_id: number;
    fk_user_id: number;
}

export type CreateTokenParams = {
    fcm_device_token: string;
    fk_user_id: number;
}