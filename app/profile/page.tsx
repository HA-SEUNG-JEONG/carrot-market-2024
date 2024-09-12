import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import React from "react";

const getUser = async () => {
    const session = await getSession();
    if (session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id
            }
        });
        if (user) return user;
    }
    notFound();
};

const page = async () => {
    const user = await getUser();
    const logOut = async () => {
        "use server";
        const session = await getSession();
        session.destroy();
        redirect("/");
    };
    return (
        <div>
            <h1>Welcome! {user?.username}</h1>
            <form action={logOut}>
                <button>log out</button>
            </form>
        </div>
    );
};

export default page;
