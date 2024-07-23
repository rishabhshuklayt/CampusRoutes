const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
    firstName: String,
    lastname: String,
    rollNumber: String,
    course: String,
    phoneNo:String,
    homeAddress: String,
    pickupPoint: String,
    dropoffPoint: String,
    password: String,
    dob :Date,
    year: Number,
    email: String,
    gender: String,
    avtar: Buffer,
})

module.exports = mongoose.model("student", studentSchema)