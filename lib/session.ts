import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

const getSession = () => {
    return getIronSession<SessionContent>(cookies(), {
        cookieName: "delicious-karrot",
        password: process.env.BCRYPT_PASSWORD!
    });
};

export default getSession;
