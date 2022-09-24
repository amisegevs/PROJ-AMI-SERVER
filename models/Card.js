const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlenght: 2,
    },
    description:{
        type: String,
        required: true,
        minlenght: 2,
    },
    address:{
        type: String,
        required: true,
        minlenght: 2,
    },
    phone:{
        type: String,
        required: true,
        minlenght: 10,
    },
    image:{
        type: String,
        required: true,
        minlenght: 2,
    },
    bizNum:{
        type: Number,
        required: true,
    },
    userId: {
    type: String,
    required: true,
  }
});

const Card = mongoose.model("card", cardSchema);
module.exports = Card;