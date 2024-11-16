async function getProduct() {
    await new Promise((resolve) => setTimeout(resolve, 5000));
}

export default async function ProductDetail({
    params: { id }
}: {
    params: { id: string };
}) {
    const product = await getProduct();
    return <span>Product Detail of the product {id}</span>;
}
