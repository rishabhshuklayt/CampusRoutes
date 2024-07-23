const express = require('express')
require('dotenv').config()

const isLoggedIn = (req, res, next)=>{
    // Check if user is logged in using session or any other method
    const token = req.cookies.token
    if(!token){
        // return res.redirect('/login')
        return res.json({ success: false, message: "User not logged in" })
    }
    jwt.verify(token, process.env.JWT_SSH, (err, decoded)=>{
        if(err){
            // return res.redirect('/login')
            return res.json({ success: false, message: "Invalid token" })
        }
        req.user = decoded
        console.log(req.user)
        next()
    })
}

module.exports = isLoggedIn