import { notFound, redirect } from "next/navigation";
import { getGitHubAccessToken } from "./githubAuth";
import { getUserEmail, getUserProfile } from "../github/github";
import { createOrUpdateUser } from "../user/userService";
import userLogin from "../userLogin";

export async function handleGitHubOAuth(code: string | null) {
    if (!code) {
        return notFound();
    }

    const accessToken = await getGitHubAccessToken(code);
    if (!accessToken) {
        return new Response(null, { status: 400 });
    }

    const { id, avatar_url, login } = await getUserProfile(accessToken);
    const email = await getUserEmail(accessToken);

    const user = await createOrUpdateUser({
        githubId: String(id),
        username: login,
        avatar: avatar_url,
        email
    });

    await userLogin(user);

    // 임시 처리
    return redirect("/dashboard");
}
