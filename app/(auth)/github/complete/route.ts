import { handleGitHubOAuth } from "@/lib/github/auth/githubOAuth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const code = request.nextUrl.searchParams.get("code");

    return handleGitHubOAuth(code);
}
