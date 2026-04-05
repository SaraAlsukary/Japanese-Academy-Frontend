export type TUser = {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    country: string;
    age: number;
    gender: string;
    educationLevel: string;
    japaneseLevel: string;
    phone: string;
    role?: string;
    show?: string;
};
export type TComment = {
    id: number;
    name: string;
    country: string;
    comment: string;
};
export type TUserData = {
    first_name: string;
    last_name: string;
    email: string;
    country: string;
    age: number;
    gender: string;
    education_level: string;
    japanese_level: string;
    phone: string;
};