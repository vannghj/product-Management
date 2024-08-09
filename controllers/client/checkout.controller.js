const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order = require("../../models/order.model");
const productsHelper = require("../../helpers/products");
module.exports.index = async (req, res) => {
    const cardId = req.cookies.cartId;
    const cart = await Cart.findOne({
        _id: cardId,
    })
    if(cart.products.length > 0) {
        for (const item of cart.products) {
            const productId = item.product_id;
            const productInfo = await  Product.findOne({
                _id: productId
            }).select("title thumbnail slug price discountPercentage");
            productInfo.priceNew = parseInt(productsHelper.priceNewOneProduct(productInfo));
            item.totalPrice = productInfo.priceNew * item.quantity;
            item.productInfo = productInfo;
        }
        cart.totalPrice = cart.products.reduce((sum, item) =>
            sum + item.totalPrice,0);
    }
    res.render("client/pages/checkout/index", {
        pageTitle: "Dat hang",
        cartDetail: cart
    });
};
module.exports.order = async (req, res) => {
    const cartId = req.cookies.cartId;
    const userInfo = req.body;
    const cart =await Cart.findOne({
        _id: cartId,
    });
    const products = [];
    for(product of cart.products) {
        const objectProduct = {
            product_id: product.product_id,
            price: 0,
            discountPercentage: 0,
            quantity: product.quantity
        };
        const productInfo = await Product.findOne({
                _id: product.product_id
        }).select("price discountPercentage");
        objectProduct.price = productInfo.price;
        objectProduct.discountPercentage = productInfo.discountPercentage;
        products.push(objectProduct);
    }
    const orderInfo = {
        cart_id: cartId,
        userInfo: userInfo,
        products: products,
    }
    const order = new Order(orderInfo);
    order.save();
    await Cart.updateOne({
        _id: cartId
    }, {
        products: []
    });
    res.redirect(`/checkout/success/${order.id}`);
};
module.exports.success = async (req, res) => {
    const order = await Order.findOne({
        _id: req.params.orderId
    })
    for(product of order.products) {
        const productInfo = await Product.findOne({
            _id: product.product_id
        }).select(("title thumbnail"));
        product.productInfo = productInfo;
        product.priceNew = productsHelper.priceNewOneProduct(product);
        product.totalPrice = product.priceNew * product.quantity
    }
    order.totalPrice = order.products.reduce((sum, item) => sum + item.totalPrice, 0);
    console.log(order.totalPrice);
    res.render("client/pages/checkout/success", {
        pageTitle: "Dat hang thanh cong",
        order:order
    });
};