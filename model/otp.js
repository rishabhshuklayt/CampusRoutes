const mongoose = require('mongoose')

const oneTimePassword = new mongoose.Schema({
    otp:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    createdAt:{
        type: Date,
        default: Date.now(),
        index: {expires:  '5m'}
    }
})


module.exports = mongoose.model('OneTimePassword', oneTimePassword);   