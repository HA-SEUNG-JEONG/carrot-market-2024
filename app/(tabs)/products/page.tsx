import ListProduct from "@/components/ListProduct";
import db from "@/lib/db";

const getProducts = async () => {
    const products = await db.product.findMany({
        select: {
            title: true,
            price: true,
            created_at: true,
            photo: true,
            id: true
        }
    });
    return products;
};

export default async function Product() {
    const product = await getProducts();
    return (
        <div className="p-5 flex flex-col gap-5">
            {product.map((product) => (
                <ListProduct key={product.id} {...product} />
            ))}
        </div>
    );
}
