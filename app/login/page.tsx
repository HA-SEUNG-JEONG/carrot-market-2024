"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import SocialLogin from "@/components/social-login";
import { redirect } from "next/navigation";
import { handleSubmit } from "./actions";
import { useFormState } from "react-dom";

export default function LogIn() {
    const [state, action] = useFormState(handleSubmit, null);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
                <FormInput
                    type="email"
                    placeholder="Email"
                    required
                    errors={[]}
                    name="email"
                />
                <FormInput
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.errors ?? []}
                    name="password"
                />
                <FormButton text="Log in" />
            </form>

            <SocialLogin />
        </div>
    );
}
