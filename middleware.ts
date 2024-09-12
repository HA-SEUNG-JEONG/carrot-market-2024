import { NextRequest } from "next/server";

const middleware = (req: NextRequest) => {
    if (req.nextUrl.pathname === "/profile") {
        return Response.redirect(new URL("/", req.url));
    }
};

export default middleware;
