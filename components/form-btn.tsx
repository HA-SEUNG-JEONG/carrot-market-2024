"use client";
import { useFormStatus } from "react-dom";

interface FormButtonProps {
    text: string;
}

export default function FormButton({ text }: FormButtonProps) {
    // useFormStatus 훅은 action을 실행하는 form과 같은 곳에서 사용할 수 없다.
    // form의 자식 요소에서만 사용 가능하다.
    const { pending } = useFormStatus();
    return (
        <button
            disabled={pending}
            className="primary-btn h-10 disabled:bg-neutral-400  disabled:text-neutral-300 disabled:cursor-not-allowed"
        >
            {pending ? "로딩 중" : text}
        </button>
    );
}
