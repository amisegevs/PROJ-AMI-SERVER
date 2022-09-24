const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const _ = require("lodash");
const User = require("../models/User");

router.get('/', auth, async (req, res) => {
    try {
        let user = await User.findById(req.payload._id)
        if (!user) return res.status(404).send("Wrong details")
        
        res.status(200).send(_.pick(user, ["_id", "name", "email", "isBiz"]))
    } catch (error) {
      return res.status(401).send(error);  
    }
});


module.exports = router;
