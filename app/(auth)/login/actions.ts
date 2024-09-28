"use server";

import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

const checkEmailExists = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true
        }
    });

    return Boolean(user);
};

const formSchema = z.object({
    email: z
        .string()
        .email()
        .toLowerCase()
        .refine(checkEmailExists, "An account with this email does not exists"),
    password: z.string()
    // .min(PASSWORD_MIN_LENGTH)
    // .regex(PASSWORD_REGEX)
});

export const Login = async (prev: unknown, formData: FormData) => {
    const data = {
        email: formData.get("email"),
        password: formData.get("password")
    };
    const result = await formSchema.safeParseAsync(data);
    if (!result.success) {
        return result.error.flatten();
    } else {
        // console.log(result.data);
        // find a user with the email
        // if the user is found, check password hash
        const user = await db.user.findUnique({
            where: {
                email: result.data.email
            },
            select: {
                id: true,
                password: true
            }
        });
        // 임시 해결책 : user가 password를 가지지 않는다면, 빈 문자와 비교
        const okPassword = await bcrypt.compare(
            result.data.password,
            user!.password ?? ""
        );
        // redirect "/profile"
        if (okPassword) {
            const session = await getSession();
            session.id = user!.id;
            session.save();
            redirect("/profile");
        } else {
            return {
                fieldErrors: {
                    password: ["Wrong password"],
                    email: []
                }
            };
        }
    }
};
