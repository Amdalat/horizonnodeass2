const Product = require("../model/ProductModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createproduct = async (req, res) => {
    const {name, producer, category, info, image} = req.body;
    console.log(req.body);

    if (!name || !producer || !category || !info ) {
        return res.status(400).json({message: "fill in the details"});
    }

    const inproduct = await Product.findOne({name});

    if (inproduct) {
        return res.status(400).json({message: "product exists"});
    }

    try {
        const saveduser = await user.save();

        const authuser = new Auth({email, password:hashedpassword, role:"manager", userid: saveduser._id });
        console.log(authuser);
        
        const savedauth = await authuser.save();
        res.status(201).json({message: "Sign up successful", savedauth});
    } catch (err) {
        res.status(500).json({message: "Error signing up", err: err.message});
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


const loginadmin = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({message: "fill in the details"});
    }

    const user = await Auth.findOne({email});

    if (!user) {
        return res.status(400).json({message: "email doesn't exist"});
    }

    console.log(user.role);
    
    if (user.role != "admin" && user.role != "manager") {
        return res.status(400).json({message: "No authorization"});
    }

    const checkedpassword = await bcrypt.compare(password, user.password);

    if (!checkedpassword) {
        return res.status(400).json({message: "incorrect details"});
    }

    const token = jwt.sign({ id: user.userid, role: "admin"}, "secret", {expiresIn: "1h"});

    res.cookie('access_token', token, { 
        httpOnly: true, 
        path: '/',   
        expires: new Date(Date.now() + 60*60*1000),
    })

    return res.status(200).json({ message: "SignIn Successful", token });
}

const logincustomer = async (req, res) => {
    const {email, password} = req.body;
    console.log(email, password);

    if (!email || !password) {
        return res.status(400).json({message: "fill in the details"});
    }

    const user = await Auth.findOne({email});

    if (!user) {
        return res.status(400).json({message: "email doesn't exist"});
    }

    if (user.role !== "customer") {
        return res.status(400).json({message: "Not a customer"});
    }

    const checkedpassword = await bcrypt.compare(password, user.password);

    if (!checkedpassword) {
        return res.status(400).json({message: "incorrect details"});
    }

    const token = jwt.sign({ id: user.userid, role: "customer" }, "secret", {expiresIn: "1h"});

    console.log(token);
    

    res.cookie('access_token', token, { 
        httpOnly: true, 
        path: '/',   
        expires: new Date(Date.now() + 60*60*1000),
    })

    return res.status(200).json({ message: "SignIn Successful", token });
}

const createcustomer = async (req, res) => {
    const {email, password, name, age} = req.body;
    console.log(email, password);

    if (!email || !password || !name || !age) {
        return res.status(400).json({message: "fill in the details"});
    }

    const inemail = await Auth.findOne({email});

    if (inemail) {
        return res.status(400).json({message: "email exists"});
    }

    const hashedpassword = await bcrypt.hashSync(password, 10);
    const user = new User({name, age });

    try {
        const saveduser = await user.save();

        const authuser = new Auth({email, password:hashedpassword, role:"customer", userid: saveduser._id });
        const savedauth = await authuser.save();
        res.status(201).json({message: "Sign up successful", savedauth});
    } catch (error) {
        res.status(500).json({message: "Error signing up", err: err.message});
    } 
    
}

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


module.exports = { getallproducts, getproductsbycat, getproduct, updateproduct, deleteproduct };