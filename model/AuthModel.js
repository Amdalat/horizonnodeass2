const mongoose = require('mongoose');

const authSchema = new mongoose.Schema({
    userid: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    email:{type: String, required: true, unique:true},
    password: {type: String, required: true},
    role:{type: String, required: true, default: "customer"},

}, {timestamps: true});

const Auth = mongoose.model("Auth", authSchema);

module.exports = Auth;