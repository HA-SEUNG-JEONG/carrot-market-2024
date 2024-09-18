import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
    [key: string]: boolean;
}

const publicOnlyrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true
};

export async function middleware(req: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyrls[req.nextUrl.pathname];
    if (!session.id) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    } else {
        // 로그인한 상태
        if (exists) {
            return NextResponse.redirect(new URL("/products", req.url));
        }
    }
}

export const config = {
    matcher: ["/", "/profile", "/create-account", "/user/:path*"]
};
