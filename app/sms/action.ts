"use server";
import { redirect } from "next/navigation";
import validator from "validator";

// refine 메소드에는 함수가 들어가는데 조건문이어야 함

import { z } from "zod";

const phoneSchema = z
    .string()
    .trim()
    .refine(
        (phone) => validator.isMobilePhone(phone, "ko-KR"),
        "Wrong Phone Number"
    );

const tokenSchema = z.coerce.number().min(100000).max(999999);

interface ActionState {
    token: boolean;
}

export const smsLogin = async (prevState: ActionState, formData: FormData) => {
    const phone = formData.get("phone");
    const token = formData.get("token");

    if (!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if (!result.success) {
            return {
                token: false,
                error: result.error.flatten()
            };
        } else {
            return {
                token: true
            };
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if (!result.success) {
            return {
                token: true,
                error: result.error.flatten()
            };
        } else {
            redirect("/");
        }
    }
};
