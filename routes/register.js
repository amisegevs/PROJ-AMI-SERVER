const express = require("express");
const router = express.Router();
const joi = require("joi");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");


const registerSchema = joi.object({
    name: joi.string().required().min(2),
    email: joi.string().required().min(6),
    password: joi.string().required().min(8),
    isBiz: joi.boolean().required()
})

router.post("/", async (req, res) => {
    try {
        // joi validation
        const {error} = registerSchema.validate(req.body);
        if (error) return res.status(400).send(error.message);

        // if user exist 
        let user = await User.findOne({email: req.body.email});
        if (user) return res.status(400).send("user already exist");

        // add new user
        user = new User(req.body);

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);     

        // create token 
        const genToken = jwt.sign({_id: user.id, isBiz: user.isBiz}, process.env.jwtKey);

        await user.save();
        res.status(201).send({token: genToken});

    } catch (error) {
        res.status(400).send("ERROR in register" + error);
    }
});

module.exports = router;
