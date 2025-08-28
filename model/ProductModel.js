const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    name: {type: String, required: true},
    producer: {type: String, required: true},
    category: {type: mongoose.Schema.Types.ObjectId, ref:"Category", required: true},
    price: {type: Number, required: true},
    stock: {type: Number, required: true},
    size: {type: String, required: true, enum:['xl', "l", "m", "s", "xs"], default: "m"},
    info: {type: String, required: true},
    image: {type: String}
}, {timestamps: true});

const categorySchema = new mongoose.Schema({
    name:{type: String, required: true},
    slug:{type: String, required: true},
    icon: {type: String}
}, {timestamps: true});

const cartSchema = new mongoose.Schema({
    productid : {type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
    userid : {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    quantity : {type: Number, required: true},
    // price : {type: Number, required: true}
}, {timestamps: true});

const discountSchema = new mongoose.Schema({
    productid : {type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
    // userid : {type: mongoose.Schema.Types.ObjectId, ref:"User", required: true},
    quantity : {type: Number, required: true},
    percentage : {type: Number, required: true},
    expirydate : {type: Date, required: true}
}, {timestamps: true});

const orderSchema = new mongoose.Schema({
    productid : {type: mongoose.Schema.Types.ObjectId, ref:"Product", required: true},
    // address : {type: String, required: true},
    // total : {type: Number, required: true},
    quantity : {type: Number, required: true},
    status : {type: String, required: true}
}, {timestamps: true});


// const Product = mongoose.model("Product", productSchema, categorySchema, cartSchema, discountSchema, orderSchema);
const Product = mongoose.model("Product", productSchema);
const Category = mongoose.model("Category", categorySchema);
const Cart = mongoose.model("Cart", cartSchema);
const Discount = mongoose.model("Discount", discountSchema);
const Order = mongoose.model("Order", orderSchema);

module.exports = {Product, Category, Cart, Discount, Order};


// admins, managers, categories, products