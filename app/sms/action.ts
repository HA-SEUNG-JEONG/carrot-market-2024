"use server";
import crypto from "crypto";
import db from "@/lib/db";
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

const createToken = async () => {
    const token = crypto.randomInt(100000, 999999).toString();
    const existsToken = await db.sMSToken.findUnique({
        where: {
            token
        },
        select: {
            id: true
        }
    });
    if (existsToken) {
        return createToken();
    }
    return token;
};

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
            // 이전 토큰 삭제
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data
                    }
                }
            });
            // 새 토큰 생성
            const token = await createToken();
            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: {
                            where: {
                                phone: result.data
                            },
                            create: {
                                phone: result.data,
                                username: crypto.randomBytes(10).toString("hex")
                            }
                        }
                    }
                }
            });
            // twilio에 토큰 저장
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
