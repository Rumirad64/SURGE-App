const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const validator = require('validator');
const argon2 = require('argon2');
var cors = require('cors')

const UserSchema = require("../../models/userSchema");
const UserModel = require("../../models/UserModel");

//! import authenticattion / authorization middleware
const { Authorize } = require('../../middleware/auth');
const { append } = require('express/lib/response');

// middleware that is specific to this router
router.use((req, res, next) => {
    next()
})

//eneble cors all origins with credentials 
router.use(cors({
    origin: '*',
    credentials: true
}));


// /api/user/register
router.post('/register', async (req, res) => {
    const newuser = new UserModel(req.body);
    try {
        newuser.validate();
        await newuser.hashPassword();
    }
    catch (err) {
        res.status(200).json({
            status: "error",
            message: err.message,
            data: null
        })
        return;
    }
    //find email or username already in db
    UserSchema.findOne({ $or: [{ email: newuser.email }, { username: newuser.username }] })
        .then(user => {
            if (user) {
                res.status(200).json({
                    status: "error",
                    message: 'Email or Username Already Exists',
                    data: null
                })
                return;
            }
            //create new user
            const newUser = new UserSchema(newuser.GetUser());
            //save user to db
            newUser.save()
                .then(function (user) {
                    res.status(200).json({
                        status: "success",
                        message: 'Your registration was successful',
                        data: user
                    })
                }).catch(err => {
                    console.log(err);
                    res.status(200).json({
                        status: "error",
                        message: 'Error! Please try again later',
                        data: null
                    })
                })
        }).catch(err => {
            res.status(200).json({
                status: "error",
                message: 'Internal server error',
                data: null
            })
        })
});

router.post('/login', async (req, res) => {
    let { username, password } = req.body;
    if (!username || !password) {
        res.status(400).json({
            status: "error",
            message: 'Bad request',
            data: null
        });
        return;
    }
    //find user in db by username or email
    UserSchema.findOne({ $or: [{ email: username }, { username: username }] })
        .then(user => {
            if (!user) {
                res.status(200).json({
                    status: "error",
                    message: 'User does not exist!',
                    data: null
                })
                return;
            }
            //compare password
            argon2.verify(user.password, password)
                .then(async (match) => {
                    if (match) {
                        //generate token
                        const token = jwt.sign({
                            _id: user._id,
                            username: user.username,
                            email: user.email
                        }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
                        res.status(200).json({
                            status: "success",
                            message: 'Login successful',
                            data: {
                                token: token,
                            }
                        })
                    } else {
                        res.status(200).json({
                            status: "error",
                            message: 'Invalid password',
                            data: null
                        })
                    }
                }).catch(err => {
                    console.log(err);
                    res.status(200).json({
                        status: "error",
                        message: 'Internal server error',
                        data: null
                    })
                })
        }).catch(err => {
            res.status(200).json({
                status: "error",
                message: 'Internal server error',
                data: null
            })
        })
})


router.get('/me', Authorize(), async (req, res) => {
    //get user from db only username email fullname phone field by _id
    UserSchema.findById(req.user._id, { username: 1, email: 1, fullname: 1, phone: 1 })
        .then(user => {
            res.status(200).json({
                status: "success",
                message: 'User found',
                data: user
            })
        }).catch(err => {
            res.status(200).json({
                status: "error",
                message: 'Internal server error',
                data: null
            })
        })
})

router.post('/update', Authorize(), async (req, res) => {
    const newuser = new UserModel(req.body);
    try {
        newuser.validate();  // all users are evil
        await newuser.hashPassword();
    }
    catch (err) {
        res.status(200).json({
            status: "error",
            message: err.message,
            data: null
        })
        return;
    }
    const _id = req.user._id;  //id comes from auth middleware

    newuser.username = req.user.username; //! disable username change by overwriting with old username

    //find email is already in db and not the same as the current user
    UserSchema.findOne({ $and: [{ email: newuser.email }, { _id: { $ne: _id } }] })
        .then(user => {
            if (user) {
                res.status(200).json({
                    status: "error",
                    message: 'Email already exists',
                    data: null
                })
                return;
            }
            else {
                //update user in db by _id but disable username field updating
                UserSchema.findByIdAndUpdate(_id, { $set: newuser.GetUser() }, { new: true })
                    .then(user => {
                        res.status(200).json({
                            status: "success",
                            message: 'User updated',
                            data: user
                        })
                    }).catch(err => {
                        res.status(200).json({
                            status: "error",
                            message: 'Internal server error',
                            data: null
                        })
                    })
            }
        })
});

router.post('/validatetoken', Authorize(), async (req, res) => {
    res.status(200).json({
        status: "success",
        message: 'Token is valid',
        data: null
    })
    //! if not valid the auth middleware will throw an error
});


router.get('/private', Authorize(), (req, res) => {
    res.json({ message: 'Welcome to private route!' });
});

module.exports = router