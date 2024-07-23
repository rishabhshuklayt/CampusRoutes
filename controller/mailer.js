const nodemailer = require('nodemailer')
const path = require('path')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: process.env.SERVICE_MAIL,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
})

async function sendOtpMail(firstName, lastName, email, otp){
    const mailOptions = {
        from: 'spiderweb07man@gmail.com',
        to: email,
        subject: 'Campus Routes - OTP Verification',
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <p>Dear ${firstName},</p>
            <p>Thank you for registering with Campus Routes. To complete your registration, please verify your email address by using the following OTP:</p>
            <p style="font-size: 24px; font-weight: bold; color: #2E86C1;">${otp}</p>
            <p>This OTP is valid for a limited time and should not be shared with anyone.</p>
            <p>If you did not request this OTP, please ignore this email.</p>
            <p>Thank you,<br>The Campus Routes Team</p>
          </div>
        `
      };
     
      try {
           await transporter.sendMail(mailOptions)
           console.log("Email sent Succesfully ")
      } catch (error) {
           console.error('Error sending email:', error);
           throw error;
      }
  
}
// Welcome GReeting EMail 

function sendWelcomeEmail(email, firstName, lastName, welcomeImagePath) {
    const mailOptions = {
        from: 'spiderweb07man@gmail.com',
        to: email,
        subject: 'Welcome to Campus Routes - Registration Successful',
        html:`<html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Campus Routes</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    background-color: #ffffff;
                    margin: 30px auto;
                    padding: 30px;
                    max-width: 650px;
                    border-radius: 10px;
                    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
                    text-align: center;
                }
                .header {
                    background-color: #28a745;
                    color: #ffffff;
                    padding: 15px;
                    border-radius: 10px 10px 0 0;
                }
                .header h1 {
                    margin: 0;
                    font-size: 28px;
                }
                .content {
                    padding: 30px;
                    background-color: #f9f9f9;
                    border-radius: 0 0 10px 10px;
                }
                .content h2 {
                    color: #333333;
                    font-size: 22px;
                }
                .content p {
                    color: #666666;
                    line-height: 1.6;
                    margin-bottom: 20px;
                }
                .content .welcome-image {
                    margin: 20px 0;
                }
                .content .welcome-image img {
                    width: 100%;
                    max-width: 500px;
                    border-radius: 10px;
                    animation: fadeIn 2s ease-in-out;
                }
                @keyframes fadeIn {
                    0% {
                        opacity: 0;
                    }
                    100% {
                        opacity: 1;
                    }
                }
                .btn {
                    display: inline-block;
                    margin: 10px 0;
                    padding: 12px 25px;
                    background-color: #28a745;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    font-size: 18px;
                    transition: background-color 0.3s ease;
                }
                .btn:hover {
                    background-color: #218838;
                }
                .footer {
                    background-color: #28a745;
                    color: #ffffff;
                    padding: 12px;
                    border-radius: 0 0 10px 10px;
                    font-size: 14px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Campus Routes!</h1>
                </div>
                <div class="content">
                    <h2>Dear ${firstName} ${lastName},</h2>
                    <p>We are thrilled to inform you that your registration for the Campus Routes system has been successfully completed!</p>
                    <p>Welcome to our community! We are excited to have you on board and are confident that our Campus Routes system will greatly enhance your campus experience.</p>
                    <div class="welcome-image">
                        <img src="cid:welcomeImage" alt="Welcome Image">
                    </div>
                    <p>If you have any questions or need further assistance, feel free to contact our support team.</p>
                    <a href="mailto:support@campusroutes.com" class="btn">Contact Support</a>
                </div>
                <div class="footer">
                    <p>Thank you,<br>The Campus Routes Team</p>
                </div>
            </div>
        </body>
        </html>
        `,
         attachments: [
             {
                filename: 'welcome Image.jpg',
                // path: '../public/images/images/Welcome Image.jpg',
                path: 'https://media.istockphoto.com/id/1312241568/photo/multi-etching-group-of-happy-students-greeting-someone-in-university-hallway.jpg?s=612x612&w=0&k=20&c=8dhlXdT0ju01rP_hp0772qvQZv8IS0tiCP6AK0dWzzo=',
                cid: 'welcomeImage' // same cid value as in the html img src
            }
         ]
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
        }
    });
}

// exporting module
module.exports = {transporter, sendOtpMail, sendWelcomeEmail};