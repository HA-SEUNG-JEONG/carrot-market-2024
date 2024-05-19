"use server";

export const handleSubmit = async (prev: unknown, data: FormData) => {
    console.log(prev);
    ("use server");
    return {
        errors: ["wrong password", "too short"]
    };
};
