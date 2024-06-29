"use server";

import { z } from "zod";

const passwordRegex = new RegExp(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/
);

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = ({
    password,
    confirmPassword
}: {
    password: string;
    confirmPassword: string;
}) => password === confirmPassword;

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string",
                required_error: "Username is required"
            })
            .min(3, "비밀번호는 3자리 이상이어야 합니다.")
            .max(10, "비밀번호는 최대 10자리입니다.")
            .toLowerCase()
            .trim()
            .refine(checkUsername, "custom error"),
        email: z.string().email(),
        password: z
            .string()
            .min(4)
            .regex(
                passwordRegex,
                "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다."
            ),
        confirmPassword: z.string().min(10)
    })
    .refine(checkPassword, {
        message: "Both password should be equal",
        path: ["confirmPassword"]
    });

export const createAccount = (prevState: any, formData: FormData) => {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    };
    const result = formSchema.safeParse(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        console.log(result.data);
    }
};
