import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ListProductProps {
    title: string;
    price: number;
    created_at: Date;
    photo: string;
    id: number;
}

const ListProduct = ({
    title,
    price,
    created_at,
    photo,
    id
}: ListProductProps) => {
    return (
        <Link href={`/products/${id}`} className="flex gap-5">
            <div className="relative size-28 rounded-md overflow-hidden">
                {/* fill 속성은 width와 height를 모를 때 유용함 */}
                <Image src={photo} alt={title} fill />
            </div>
            <div className="flex flex-col gap-1 *:text-white">
                <span className="text-lg">{title}</span>
                <span className="text-sm text-neutral-500">
                    {created_at.toString()}
                </span>
                <span className="text-lg font-semibold">{price}</span>
            </div>
        </Link>
    );
};

export default ListProduct;
