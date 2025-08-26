const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {type:String, unique:true, required: true},
    age: {type:Number, required: true },
}, {timestamps: true});

const User = mongoose.model("User", userSchema);

module.exports = User;