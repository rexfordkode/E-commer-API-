const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken'); //generate token
const bcrypt = require('bcryptjs');

//Checking validation for request parameters
const { check, validationResult } = require('express-validator');
const gravatar = require('gravatar'); //Get user image by email
const auth = require('../middleware/auth');

//Model
const User = require('../models/User');

//@router POST api/users/register
//@desc User Information 
// @accss Private
router.get('/', auth, async (req, res) => {
    try {
        // Get user information by id
        const user =  await User.findById(req.user.id).select('-password')
        res.json(user)
    } catch (error) {
        console.log(err.message);
        res.status(500).send('Server Error')
    }
})

//@router POST api/users/register
//@desc Register User
// @accss Public
router.post('/register',
//validation function
    [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Include a valid email address').isEmail(),
    check('password', 'Please enter password with 6 or more characters').isLength({
        min: 6
    })
    ], async (req, res) => {
        console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(404).json({ errors: errors.array() });
    }
    //getting email address
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email })
        //If use exist 
        if (user) {
            return res.status(400).json({
                errors: [
                    {
                        msgs:
                            'User already exist',
                    }
                ]
            });
        }
        //If Not get user from email
        const avatar = gravatar.url(email, {
            s: '200', // Size
            r: 'pg',//Rate
            d: 'mm'
        })
        //Creating a new user object
        user = new User({
            name,email,avatar, password
        })
        const salt = await bcrypt.genSalt(10); //generate salt contain 10
        user.password = await bcrypt.hash(password, salt) //User password and salt hashed
        await user.save(); //Saving user to data base
        
        //Payload to generate token
        const payload = {
            user: {
                id: user.id,
            }
        }
        jwt.sign(
            payload,
            process.env.JWT_SECRET, {
                expiresIn: 360000 //for development and production
        }, (err, token) => {
                if (err) throw err
                res.json({token})
            }
        )
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
});

//@router POST api/users/register
//@desc Login User
// @accss Public
router.post('/login',[
// Validation for email and password
    check('email', 'please include a valid email').isEmail(),
    check('password', 'please include a valid password').exists(),
], async (req, res) => {
    //  If errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errrors: errors.array()
        })
    }

    //If everything is good
    // get email and password from request body
    const { email, password } = req.body;
    try {
        let user = await User.findOne({
            email: email
        });
        //If user not found in database
        if (!user) {
            return res.status(404).json({
                errors: [{
                    msg: 'Invalid credentions'
                }
                ]
            })
        }
        //Know user found by email lets compare password
        const isMatch = await bcrypt.compare(password, user.password);

        //Password dont isMatch
        if (!isMatch) {
            return res.status(400).json({
                errors: [{
                    msg: 'Invalid credentions'
            }]})
        }
        // Payload for jwt validation
        const payload = {
            user: {
                id: user.id
            }
        }
        jwt.sign(
            payload,
            process.env.JWT_SECRET, {
                expiresIn: 360000
        }, (err, token) => {
                if (err) throw err;
                res.json({
                    token
                })
            }
        )

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error')
    }
})

module.exports = router
