const Product = require("../model/ProductModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getallproducts = async (req, res) => {
    const products = await Product.find();

    if (!products) {
        return res.status(400).json({message: "No products"});
    }

    try {
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: "Couldn't get products", err: err.message});
    } 
    
}

const getproductsbycat = async (req, res) => {
    const products = await Product.find({ category: req.params.category }, "-category");

    if (!products) {
        return res.status(400).json({message: `No  products under ${req.params.category}`});
    }

    try {
        res.status(200).json({ Category: req.params.category, Products: products });
    } catch (error) {
        res.status(500).json({message: `Couldn't get products`, err: err.message});
    } 
}

const getproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateproduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteproduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { getallproducts, getproductsbycat, getproduct, updateproduct, deleteproduct };