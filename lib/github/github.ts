interface Email {
    email: string;
    primary: boolean;
    verified: boolean;
    visibility: "private" | "public" | null;
}

export async function getUserProfile(token: string) {
    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: "no-cache"
    });

    if (!userProfileResponse.ok) {
        throw new Error("Failed to fetch user profile");
    }
    return await userProfileResponse.json();
}

export async function getUserEmail(token: string) {
    const userEmailResponse = await fetch(
        "https://api.github.com/user/emails",
        {
            headers: {
                Authorization: `Bearer ${token}`
            },
            cache: "no-cache"
        }
    );
    if (!userEmailResponse.ok) {
        throw new Error("Failed to fetch user emails");
    }
    const emails: Email[] = await userEmailResponse.json();
    // Filter for the first email with visibility 'public'
    const publicEmail = emails.filter(
        (email) => email.visibility === "public"
    )[0];
    return publicEmail ? publicEmail.email : null;
}
