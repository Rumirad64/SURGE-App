const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const validator = require('validator');
const argon2 = require('argon2');
var cors = require('cors')


//! import authenticattion / authorization middleware
const { Authorize } = require('../../middleware/auth');

const { RegisterUser, LoginUser, GetUser, UpdateUser } = require('../../services/user.js');

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
    //call register service
    try {
        let result = await RegisterUser(req.body);
        res.json({
            status: "success",
            message: 'Your registration was successful',
            data: result
        });
    } catch (ex) {
        res.json({
            status: "error",
            message: ex.message,
            data: null
        });
    }
});

router.post('/login', async (req, res) => {
    //call login service
    try {
        let result = await LoginUser(req.body);
        res.json({
            status: "success",
            message: 'Login successful',
            data: {
                token: result
            }
        });
    } catch (ex) {
        res.json({
            status: "error", 
            message: ex.message,
            data: null 
        });
    }
})


router.get('/me', Authorize(), async (req, res) => {
    //call get user service
    try {
        let result = await GetUser(req.user._id);
        res.json({
            status: "success",
            message: 'User data',
            data: result
        });
    } catch (ex) { 
        res.json({ 
            status: "error", 
            message: ex.message,
            data: null 
        });
    } 
}) 

router.post('/update', Authorize(), async (req, res) => {
    //call update user service
    try { 
        let result = await UpdateUser(req.user, req.body);
        res.json({
            status: "success",
            message: 'User data updated',
            data: result
        }); 
    } catch (ex) { 
        res.json({ 
            status: "error", 
            message: ex.message, 
            data: null 
        });
    }
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