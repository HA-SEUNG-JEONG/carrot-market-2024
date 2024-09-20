import { redirect } from "next/navigation";
import getSession from "./session";

interface User {
    id: number;
}

const userLogin = async (user: User) => {
    const session = await getSession();
    session.id = user.id;
    await session.save();
    return redirect("/profile");
};

export default userLogin;
