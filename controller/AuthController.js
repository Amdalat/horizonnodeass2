const Auth = require("../model/AuthModel");
const User = require("../model/UserModel");

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createmanager = async (req, res) => {
    const {email, password, name, age} = req.body;
    console.log(email, password, name, age);

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

        const authuser = new Auth({email, password:hashedpassword, role:"manager", userid: saveduser._id });
        console.log(authuser);
        
        const savedauth = await authuser.save();
        res.status(201).json({message: "Sign up successful", savedauth});
    } catch (err) {
        res.status(500).json({message: "Error signing up", err: err.message});
    } 
    
}

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

    const token = jwt.sign({ id: user.userid, role: "admin"}, process.env.JWTS, {expiresIn: "1h"});

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

    const token = jwt.sign({ id: user.userid, role: "customer" }, process.env.JWTS, {expiresIn: "1h"});

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

const getalladmins = async (req, res) => {
    const admins = await Auth.find({role: "admin"});
    const managers = await Auth.find({role:"manager"});

    if (!admins && !managers) {
        return res.status(400).json({message: "No Admins"});
    }

    try {
        res.status(200).json({Admincount: admins.length + managers.length, Admins: admins, Managers: managers});
    } catch (error) {
        res.status(500).json({message: "Couldn't get admins", err: err.message});
    } 
    
}

const getadminsbyrole = async (req, res) => {
    const users = await Auth.find({ role: req.params.role }, "-role");

    if (!users) {
        return res.status(400).json({message: `No ${req.params.role}s`});
    }

    try {
        res.status(200).json({ role: req.params.role, Number: users.length, RoleList: users});
    } catch (error) {
        res.status(500).json({message: `Couldn't get ${req.params.role}s`, err: err.message});
    } 
}

const getadmin = async (req, res) => {
  try {
    const user = await Auth.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const updateadmin = async (req, res) => {
  try {
    const authuser = await Auth.findById(req.params.id);
    const updated = await User.findByIdAndUpdate(authuser.userid, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteadmin = async (req, res) => {
  try {
    const authuser = await Auth.findById(req.params.id);
    const user = await User.findById(authuser.userid);
    const deletedauth = await Auth.findByIdAndDelete(authuser);
    const deleteduser = await User.findByIdAndDelete(user);
    res.status(200).json(deletedauth, deleteduser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createmanager, loginadmin, logincustomer, createcustomer, getalladmins, getadminsbyrole, getadmin, updateadmin, deleteadmin };