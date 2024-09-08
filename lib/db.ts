import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const test = async () => {
    const token = await db.sMSToken.create({
        data: {
            token: "1212112",
            user: {
                connect: {
                    id: 3
                }
            }
        }
    });
    console.log(token);
};

test();

export default db;
