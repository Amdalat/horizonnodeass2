const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    slug: {type: String, required: true},
    name: {type: String, required: true},
    producer: {type: String, required: true},
    category: {type: String, required: true},
    info: {type: String, required: true},
    image: {type: String}
}, {timestamps: true});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;