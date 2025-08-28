const {Product, Category, Cart, Discount, Order} = require("../model/ProductModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createproduct = async (req, res) => {
    const {name, producer, category, info, price, stock, size} = req.body;
    console.log(req.body);

    if (!name || !producer || !category || !info || !price|| !stock|| !size) {
        return res.status(400).json({message: "fill in the details"});
    }

    const product = await Product.findOne({name});
    if (product) {
        return res.status(400).json({message: "product exists"});
    }

    console.log(category.toLowerCase());
    const cat = await Category.findOne({name: category.toLowerCase()});
    if (!cat) {
        return res.status(400).json({message: "category doesnt exist"});
    }

    //for size

    try {
        const slug = name.split(" ").join("_").toLowerCase().replace(/[^a-z0-9]/g, '');
        const savedproduct = new Product({
            ...req.body,
            category: cat._id,
            slug,
            image: req.file ? req.file.path : ''
        });

        console.log(savedproduct);

        const productsaved = await savedproduct.save();

        res.status(201).json({message: "Product created successfully", productsaved});
    } catch (err) {
        res.status(500).json({message: "Error creating project", err: err.message});
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


const createcat = async (req, res) => {
    const {name} = req.body;
    console.log(req.body);

    if (!name) {
        return res.status(400).json({message: "fill in the name"});
    }

    const cat = await Category.findOne({name});

    if (cat) {
        return res.status(400).json({message: "Category exists"});
    }

    try {
        const slug = name.split(" ").join("_").toLowerCase().replace(/[^a-z0-9]/g, '');
        const savedcat = new Category({
            name,
            slug,
            icon: req.file ? req.file.path : ''
        });

        console.log(savedcat);

        const catsaved = await savedcat.save();

        res.status(201).json({message: "Category created successfully", catsaved});
    } catch (err) {
        res.status(500).json({message: "Error creating category", err: err.message});
    } 
    
}

const getcat = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    res.status(200).json(cat);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updatecat = async (req, res) => {
  try {
    const {name} = req.body;
    const slug = name.split(" ").join("_").toLowerCase().replace(/[^a-z0-9]/g, '');

    const updated = await Category.findByIdAndUpdate(req.params.id, {name, slug}, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deletecat = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    res.status(200).json(deleted);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getallcats = async (req, res) => {
    const cats = await Category.find();

    if (!cats) {
        return res.status(400).json({message: "No category"});
    }

    try {
        res.status(200).json({categoriescount: cats.length,Categories: cats});
    } catch (error) {
        res.status(500).json({message: "Couldn't get category", err: err.message});
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


module.exports = {createproduct, getproduct, updateproduct, deleteproduct, getallproducts, createcat, getcat, updatecat, deletecat, getallcats };