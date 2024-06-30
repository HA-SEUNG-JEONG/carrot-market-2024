"use client";

import Input from "@/components/input";
import SocialLogin from "@/components/social-login";

import { Login } from "./actions";
import { useFormState } from "react-dom";
import Button from "@/components/button";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function LogIn() {
    const [state, action] = useFormState(Login, null);

    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.</h2>
            </div>
            <form action={action} className="flex flex-col gap-3">
                <Input
                    type="email"
                    placeholder="Email"
                    required
                    name="email"
                    errors={state?.fieldErrors.email}
                />
                <Input
                    type="password"
                    placeholder="Password"
                    required
                    errors={state?.fieldErrors.password}
                    name="password"
                    minLength={PASSWORD_MIN_LENGTH}
                />
                <Button text="Log in" />
            </form>

            <SocialLogin />
        </div>
    );
}
