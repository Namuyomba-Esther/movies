const config = require('config');
const jwt = require('jsonwebtoken');
const joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const User = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Invalid email or password');

    const validPassword = await bcrypt.compare(req.body.password, user.pasword);
    if (!validPassword) return res.status(400).send('Invalid email or password');

    const token = jwt.sign({_id: user._id}, config.get('jwtPrivateKey'));
    res.send(token);
});

function validateUser(req){
    const schema = {
        email: joi.string().min(5).max(255).required().email(),
        password: joi.string().min(5).max(255).required()
    };
    return joi.validate(user, schema);
}

module.exports = router;