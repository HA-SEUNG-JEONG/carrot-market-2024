"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { getIronSession } from "iron-session";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

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

            .toLowerCase()
            .trim()
            .refine(checkUsername, "custom error"),

        email: z.string().email().toLowerCase(),

        password: z.string().min(PASSWORD_MIN_LENGTH),
        // .regex(
        //     PASSWORD_REGEX,
        //     "비밀번호는 소문자, 대문자, 숫자, 특수문자를 포함해야 합니다."
        // )
        confirmPassword: z.string().min(PASSWORD_MIN_LENGTH)
    })

    .superRefine(async ({ username }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            }
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This username is already taken",
                path: ["username"],
                fatal: true
            });
            z.NEVER;
        }
        // fatal:true, z.NEVER로 설정하면 이후에 다른 refine이 나와도 실행 X
    })
    .superRefine(async ({ email }, ctx) => {
        const user = await db.user.findUnique({
            where: {
                email
            },
            select: {
                id: true
            }
        });
        if (user) {
            ctx.addIssue({
                code: "custom",
                message: "This email is already taken",
                path: ["email"],
                fatal: true
            });
            z.NEVER;
        }
        // fatal:true, z.NEVER로 설정하면 이후에 다 른 refine이 나와도 실행 X
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
        const hashedPassword = await bcrypt.hash(result.data.password, 12);

        const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword
            },
            select: {
                id: true
            }
        });

        // 로그인 처리
        const session = await getSession();
        session.id = user.id;
        await session.save();
        redirect("/profile");
        // '/'로 리다이렉트
    }
};
