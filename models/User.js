const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minleght: 2
    },
    email:{
        type: String,
        required: true,
        unique: true,
        minleght: 6
    },
    password:{
        type: String,
        required: true,
        minleght: 8
    },
    isBiz:{
        type: Boolean,
        required: true
    }
})

const User = mongoose.model("users", userSchema);
module.exports = User;
