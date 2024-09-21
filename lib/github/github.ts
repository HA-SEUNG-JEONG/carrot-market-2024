interface Email {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: "private" | "public" | null;
}

const GITHUB__USER_URL = "https://api.github.com/user";

const userResponse = (url: string, token: string) => {
    return fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: "no-cache"
    });
};

export async function getUserProfile(token: string) {
    const userProfileResponse = await userResponse(
        `${GITHUB__USER_URL}`,
        token
    );

    if (!userProfileResponse.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await userProfileResponse.json();
}

export async function getUserEmail(token: string) {
    const userEmailResponse = await userResponse(
        `${GITHUB__USER_URL}/emails`,
        token
    );
    if (!userEmailResponse.ok) {
        throw new Error("Failed to fetch user emails");
    }
    const emails: Email[] = await userEmailResponse.json();
    const publicEmail = emails.filter(
        (email) => email.visibility === "public"
    )[0];
    return publicEmail ? publicEmail.email : null;
}
