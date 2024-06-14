const express = require('express');
const router = express.Router();
const rateLimit = require("express-rate-limit");

// MONGODB USER MODEL
const User = require('./../models/user');

// PASSWORD HANDLER
const bcrypt = require('bcrypt');

// RATE LIMIT FUNCTIONS
const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 MINUTES
    max: 5,                    // LIMIT EACH IP TO 5 REQUESTS PER windowMs
    message: {
        status: "FAILED",
        message: "Too many requests, please try again later."
    }
});


// SIGNUP
router.post('/signup', (req, res) => {
    // DESTRUCTURE FIELDS FROM REQUEST BODY
    let {
        firstName, 
        secondName,
        dateOfBirth,
        username,
        email,
        password,
    } = req.body

    // TRIM WHITESPACE FROM INPUT FIELDS
    firstName = firstName.trim();
    secondName = secondName.trim();
    dateOfBirth = dateOfBirth.trim();
    username = username.trim();
    email = email.trim();
    password = password.trim();

    // CHECK FOR EMPTY FIELDS
    if (firstName === "" || secondName === "" || dateOfBirth === "" || username === "" || email === "" || password === "") {
        // RETURN RESPONSE IF ANY FIELD IS EMPTY
        res.json({
            status: "FAILED",
            message: "Empty Input Fields!",
        });
    // VALIDATE FIRST NAME CONTAINS ONLY LETTERS
    } else if(!/^[a-zA-Z ]+$/.test(firstName)) {
        // RETURN RESPONSE IF FIRST NAME IS INVALID
        res.json({
            status: "FAILED",
            message: "Invalid First Name Entered",
        });
    // VALIDATE SECOND NAME CONTAINS ONLY LETTERS
    } else if(!/^[a-zA-Z ]+$/.test(secondName)) {
        // RETURN RESPONSE IF SECOND NAME IS INVALID
        res.json({
            status: "FAILED",
            message: "Invalid Second Name Entered",
        });
    // VALIDATE EMAIL FORMAT
    } else if(!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        // RETURN RESPONSE IF EMAIL IS INVALID
        res.json({
            status: "FAILED",
            message: "Invalid email Entered",
        });
    // VALIDATE DATE OF BIRTH FORMAT
    } else if(isNaN(Date.parse(dateOfBirth))) {
        // RETURN RESPONSE IF DATE OF BIRTH IS INVALID
        res.json({
            status: "FAILED",
            message: "Invalid DOB Entered",
        });
    // VALIDATE PASSWORD STRENGTH
    } else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])(?=.{8,})/.test(password)) {
        // RETURN RESPONSE IF PASSWORD DOES NOT MEET CRITERIA
        res.json({
            status: "FAILED",
            message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one special character!",
        });
    } else {
        // CHECK IF USER ALREADY EXISTS
        User.findOne({ username }).then(existingUser => {
            if (existingUser) {
                // A USER ALREADY EXISTS WITH THE PROVIDED USERNAME
                res.json({
                    status: "FAILED",
                    message: "Username already exists. Please choose a different username.",
                });
            } else {
                // USERNAME IS UNIQUE, PROCEED WITH OTHER VALIDATIONS AND SIGNUP PROCESS
                
                // CHECK IF EMAIL ALREADY EXISTS
                User.findOne({ email }).then(existingEmailUser => {
                    if (existingEmailUser) {
                        // A USER ALREADY EXISTS WITH THE PROVIDED EMAIL
                        res.json({
                            status: "FAILED",
                            message: "User with provided email already exists!",
                        });
                    } else {
                        // USER DOESN'T EXIST SO WE CREATE A NEW USER
                        
                        // PASSWORD HANDLING
                        const saltRounds = 10;
                        bcrypt.hash(password, saltRounds).then(hashedPassword => {
                            const newUser = new User({
                                firstName,
                                secondName,
                                dateOfBirth,
                                username,
                                email,
                                password: hashedPassword,
                            });
    
                            newUser.save().then(result => {
                                res.json({
                                    status: "SUCCESS",
                                    message: "Signup Successful",
                                    data: result,
                                });
                            }).catch(err => {
                                res.json({
                                    status: "FAILED",
                                    message: "An error occurred while saving user account",
                                    data: err,
                                });
                            });
                        }).catch(err => {
                            res.json({
                                status: "FAILED",
                                message: "An error occurred while hashing the password!",
                            });
                        });
                    }
                }).catch(err => {
                    console.log(err);
                    res.json({
                        status: "FAILED",
                        message: "An error occurred while checking for existing user!",
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "FAILED",
                message: "An error occurred while checking for existing user!",
            });
        });
    }
})


// LOGIN ROUTE
router.post('/login', loginRateLimit, async (req, res) => {
    try {
        // EXTRACT EMAIL AND PASSWORD FROM REQUEST BODY
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        // VALIDATE EMAIL FORMAT
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                status: "FAILED",
                message: "Invalid email format"
            });
        }

        // VALIDATE PASSWORD LENGTH
        if (password.length < 8) {
            return res.status(400).json({
                status: "FAILED",
                message: "Password must be at least 8 characters long"
            });
        }

        // FIND USER BY EMAIL
        const user = await User.findOne({ email });

        // IF USER NOT FOUND, RETURN ERROR RESPONSE
        if (!user) {
            return res.status(404).json({
                status: "FAILED",
                message: "No account associated with this email"
            });
        }

        // COMPARE HASHED PASSWORD
        const passwordMatch = await bcrypt.compare(password, user.password);

        // IF PASSWORD DOESN'T MATCH, RETURN ERROR RESPONSE
        if (!passwordMatch) {
            return res.status(401).json({
                status: "FAILED",
                message: "Invalid password entered"
            });
        }

        // RESET RATE LIMIT FOR THIS IP ON SUCCESSFUL LOGIN
        loginRateLimit.resetKey(req.ip);

        // RETURN SUCCESS RESPONSE
        res.json({
            status: "SUCCESS",
            message: "Sign In Successful",
            data: user,
        });
        
    } catch (err) {
        // CATCH ANY ERRORS AND RETURN SERVER ERROR RESPONSE
        console.error("Login error:", err);
        res.status(500).json({
            status: "FAILED",
            message: "Internal Server Error"
        });
    }
});

module.exports = router;