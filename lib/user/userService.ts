import db from "../db";

interface UserData {
    githubId: string;
    username: string;
    avatar: string;
    email: string | null;
}

export async function createOrUpdateUser(userData: UserData) {
    const { githubId, username, avatar, email } = userData;

    const existingUser = await db.user.findUnique({
        where: {
            github_id: githubId
        },
        select: {
            id: true
        }
    });

    if (existingUser) {
        return db.user.update({
            where: {
                id: existingUser.id
            },
            data: {
                avatar,
                email
            },
            select: {
                id: true
            }
        });
    }

    const sameUsername = await db.user.findUnique({
        where: {
            username
        },
        select: {
            id: true
        }
    });

    const finalUsername = sameUsername ? `${username}${githubId}` : username;

    return db.user.create({
        data: {
            username: finalUsername,
            github_id: githubId,
            avatar,
            email
        },
        select: { id: true }
    });
}
