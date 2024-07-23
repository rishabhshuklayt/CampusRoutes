const express = require('express');
const session = require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const router = express.Router();

const { sendOtpMail, sendWelcomeEmail } = require('../controller/mailer');
const { generateOtp } = require('../controller/otpGenerator');
const studentModel = require('../model/student');
const otpModel = require('../model/otp');
require('dotenv').config();

// Multer setup
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Middleware for body parsing
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Register route
router.get('/register', (req, res) => {
    res.render('Registration');
});

router.post('/register', upload.single('avatar'), async (req, res, next) => {
    const {
        firstName,
        lastName,
        rollNumber,
        course,
        homeAddress,
        pickupPoint,
        dropoffPoint,
        dob,
        year,
        phoneNo,
        email,
        gender,
        password,
    } = req.body;

    const avatar = req.file;
    console.log("Destructuring complete");

    try {
        // Async hashing
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = {
            firstName,
            lastName,
            rollNumber,
            course,
            homeAddress,
            pickupPoint,
            dropoffPoint,
            dob,
            year,
            phoneNo,
            email,
            gender,
            avatar: avatar ? avatar.buffer : null,
            password: hashedPassword,
        };

        console.log("User object created");

        // Set session data
        req.session.user = user;
        console.log("Session initiated");

        // Generating OTP
        const otp = await generateOtp();
        console.log("OTP generated");

        const newOtp = new otpModel({ otp, email });
        await newOtp.save();
        console.log("OTP saved");

        // Send OTP email
        await sendOtpMail(firstName, lastName, email, otp);
        res.redirect('/auth/verifyotp');
    } catch (error) {
        console.log("Error during registration:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Verify OTP route
router.get('/verifyotp', (req, res) => {
    res.render('verifyotp');
});

router.post('/verifyotp', async (req, res, next) => {
    const { clientOtp } = req.body;

    if (!req.session.user) {
        return res.status(400).json({ message: 'Session expired or user not registered' });
    }

    const userData = req.session.user;

    try {
        console.log(clientOtp)
        console.log(userData.email)
        const result = await otpModel.findOne({ otp: clientOtp, email: userData.email });
        console.log(result)
        if (!result) {
            return res.status(401).json({ message: 'Invalid OTP' });
        }

        const newUser = new studentModel(userData);
        await newUser.save();

        // Generating JWT token
        const token = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.JWT_SSH, { expiresIn: '2h' });

        // Setting token in cookies
        res.cookie("token", token);

        // Sending Welcome email
        await sendWelcomeEmail(newUser.email, newUser.firstName, newUser.lastName);
        
        // Destroy session after successful verification
        req.session.destroy();
        res.redirect('/test');

        
    } catch (error) {
        console.log("Error during OTP verification:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
