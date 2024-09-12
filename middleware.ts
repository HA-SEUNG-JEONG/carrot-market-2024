import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const pathname = req.nextUrl.pathname;
    if (pathname === "/") {
        const response = NextResponse.next();
        response.cookies.set("middleware-cookie", "hello");
        return response;
    }
    if (req.nextUrl.pathname === "/profile") {
        return Response.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: ["/", "/profile", "/create-account", "/user/:path*"]
};
