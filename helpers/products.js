module.exports.priceNewProduct = (products) => {
    const newProducts = products.map(item => {
        item.priceNew = (item.price*(100 - item.discountPercentage)/100).toFixed();
        return item;
    });
    return newProducts
}
module.exports.priceNewOneProduct = (product) => {
    return (product.price * (100 - product.discountPercentage) / 100).toFixed();
}