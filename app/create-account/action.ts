"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";

const checkUsername = (username: string) => !username.includes("potato");

const checkPassword = ({
    password,
    confirmPassword
}: {
    password: string;
    confirmPassword: string;
}) => password === confirmPassword;

const checkUniqueUsername = async (username: string) => {
    // email 및 username이 이미 존재하는 지 확인
    const user = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    });
    return !Boolean(user);
};

const checkUniqueUserEmail = async (email: string) => {
    // email 및 username이 이미 존재하는 지 확인
    const userEmail = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });
    return Boolean(userEmail) === false;
};

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string",
                required_error: "Username is required"
            })

            .toLowerCase()
            .trim()
            .refine(checkUsername, "custom error")
            .refine(checkUniqueUsername, "Username은 유니크해야합니다."),
        email: z
            .string()
            .email()
            .toLowerCase()
            .refine(checkUniqueUserEmail, "email은 유니크해야합니다."),
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH)
            .regex(
                PASSWORD_REGEX,
                "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다."
            ),
        confirmPassword: z.string().min(PASSWORD_MIN_LENGTH)
    })
    .refine(checkPassword, {
        message: "Both password should be equal",
        path: ["confirmPassword"]
    });

export const createAccount = async (prevState: any, formData: FormData) => {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword")
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        // 비밀번호 해싱
        // db에 유저 정보 저장하기
        // 로그인 처리
        // '/'로 리다이렉트
    }
};
