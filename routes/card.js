const express = require("express");
const joi = require("joi");
const _ = require("lodash");
const Card = require("../models/Card");
const auth = require("../middlewares/auth");
const User = require("../models/User");
const router = express.Router();

const cardSchema = joi.object({
  name: joi.string().required().min(2),
  description: joi.string().required().min(2),
  address: joi.string().required().min(2),
  phone: joi.string().required().min(10),
  image: joi.string().required().min(2),
});

// creat a card
router.post("/", auth, async (req, res) => {
    try {
        // joi validation
        const {error} = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);
        
        //create random bizNum
        let bizFlag = true;
        
        while (bizFlag) {
            var randomBiznum = _.random(1, 9999);
            let checkCard = await Card.findOne({bizNum: randomBiznum});
            if (!checkCard) bizFlag = false;
        }
        
        // add new card
        let card = new Card(req.body);
        card.bizNum = randomBiznum;
        card.userId = req.payload._id;
        await card.save();
        
        res.status(201).send("Card was added successfuly" + card);
    } catch (error) {
        res.status(400).send("Error in card " + error);  
    }
});
// get all user_id cards
router.get("/my-cards", auth, async (req, res) => {
    try {
         let cards = await Card.find({userId: req.payload._id});
         res.status(200).send(cards)
    } catch (error) {
        res.status(400).send("No cards for user" + error)
    }
});
// get all cards
router.get("/all-cards", auth, async (req, res) => {
    try {
        let cards = await Card.find();
        res.status(200).send(cards);
    } catch (error) {
        res.status(400).send(error);
    }
});

// get specific card by _id
router.get("/:id", auth, async (req, res) => {
    try {
        let card = await Card.findById(req.params.id);
        if (!card) return res.status(404).send("No such card");
        res.status(200).send(card);
    } catch (error) {
        res.status(400).send(error);         
    }
});

// update specific card by _id
router.put("/:id", auth, async (req, res) => {
    try {
        // check if card exist
        let card = await Card.findById(req.params.id);
        if (!card) return res.status(400).send("No such card for update");
        
        // joi validation
        const { error } = cardSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);
        
        // update card in db
        card = await Card.findByIdAndUpdate(req.params.id, req.body, {new: true,});
        if (!card) return res.status(404).send("No such card");
        res.status(201).send(card);
    } catch (error) {
        res.status(400).send(error);    
    }
});

// delete specific card by id
router.delete("/:id", auth, async (req, res) => {
    try {
        // check if exist
        let card = await Card.findById(req.params.id);
        if (!card) return res.status(400).send("No such card to delete");
        
        // delete card in db
        card = await Card.findByIdAndRemove(req.params.id);
        if (!card) return res.status(404).send("No such card");
        res.status(200).send("Card removed successfully");
    } catch (error) {
        res.status(400).send(error);  
    }
}); 




module.exports = router;