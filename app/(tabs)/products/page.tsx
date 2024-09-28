const getProducts = async () => {
    await new Promise((resolve) => setTimeout(resolve, 100000));
};

export default async function Product() {
    const product = await getProducts();
    return (
        <div>
            <h1 className="text-white text-4xl">Product!</h1>
        </div>
    );
}
