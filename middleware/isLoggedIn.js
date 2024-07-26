const jwt = require('jsonwebtoken')
const studentModel = require('../model/student')
require('dotenv').config()

const isLoggedIn = async(req, res, next)=>{
    const token = req.cookies.token;

    if(!token){
        return res.redirect('/auth/login')
    }
  try {
    
    const decode = jwt.verify(token, process.env.JWT_SSH)
    const student = await studentModel.findById(decode._id);
    
    if(!student){
        return res.redirect('/auth/login')
    }
    req.student = student;
    next();

  } catch (error) {
    console.log('Error during token verification:', error);
    return res.status(401).redirect('/auth/login');
  }
}

module.exports = isLoggedIn;
