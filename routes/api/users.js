const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");

// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/UserSchema");

// @route POST api/users/register
// @desc Register user
// @access Public

router.post("/register", async (req, res) => {
    try {
        //Form validation
        const {errors, isValid} = validateRegisterInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const user = await User.findOne({email: req.body.email});

        if (user) {
            return res.status(400).json({email: "Email already exists"});
        } else {
            const newUser = new User({
                name: req.body.name,
                password: req.body.password,
                email: req.body.email,
                type: req.body.type || 'STUDENT'
            });

            // Hash password before storing in database
            const rounds = 10;
            const salt = await bcrypt.genSalt(rounds);
            newUser.password = await bcrypt.hash(newUser.password, salt);
            const user = await newUser.save();
            res.json(user);
        }

    } catch (err) {
        console.log('err', err);
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

// @route POST api/users/login
// @desc Login user and return JWT token
// @access Public

router.post("/login", async (req, res) => {
    try {
        //Form Valdiation
        const {errors, isValid} = validateLoginInput(req.body);

        if (!isValid) {
            return res.status(400).json(errors);
        }

        const email = req.body.email;
        const password = req.body.password;

        //Find user by Email
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({emailNotFound: "Email not found"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            // Create JWT Payload
            const payload = {
                id: user.id,
                name: user.name,
                userType: user.userType
            };

            // Sign token
            const token = await jwt.sign(payload,
                keys.secretOrKey,
                {
                    expiresIn: 31556926
                });

            res.json({
                success: true,
                token: "Bearer " + token
            });

        } else {
            return res
                .status(400)
                .json({passwordIncorrect: "Password incorrect"});
        }
    } catch (err) {
        console.log('err', err);
        return res
            .status(500)
            .json({internalServerError: "Internal Server Error"});
    }
});

module.exports = router;