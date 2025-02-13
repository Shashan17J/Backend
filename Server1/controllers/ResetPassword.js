const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require('bcrypt');

// resetPassword

exports.resetPasswordToken = async (req, res) => {
    try{
            // get email from req body
    const email = req.body.email;
    // check user for this email, email verification
    const user = await User.findOne({email: email});
    if(!user) {
        return res.json({
            success:false,
            message:"Your Email is not registered" });
        }
    // generate token
    const token = crypto.randomUUID();
    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
                                      {email:email},
                                      {
                                        token:token,
                                        resetPasswordExpires: Date.now() + 5*60*1000,
                                      },
                                      {new:true}); //now we get Updated doc

    // genrate frontend link
    const url = `http://localhost:3000/update-password/${token}`

    // send mail containg the url
    await mailSender(email,
                    "Password Reset Link",
                    `Password Reset Link: ${url}`);

    // return response
    return res.json({
        success:true,
        message:"Email sent successfullt, please check email and change password"
    })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset password mail',
        })
    }
}

// resetPassword

exports.resetPassword = async (req, res) => {
    try{
        // data detch from req body
       // token in req body inserted in front-end
    const {password, confirmPassword, token} = req.body;

    // validation
    if(password !== confirmPassword) {
        return res.json({
            success:false,
            message:'Password not matching',
        })
    }

    // get userdetails from db using token
    const userDetails = await User.findOne({token: token});

    // if no entry
    if(!userDetails) {
        return res.json({
            success:false,
            message:'Token is invalid',
        })
    }

    // token time check
    if(userDetails.resetPassword < Date.now()) {
        return res.json({
            success:false,
            message:'Token is expired, please regenrate is your token',
        })
    }

    // hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // update password
    await User.findOneAndUpdate(
        {token:token},
        {password:hashedPassword},
        {new:true},
    )

    // return response
    return res.status(200).json({
        success:true,
        message:'Password reset successful',
    })

    } catch(error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:'Something went wrong while sending reset pwd mail',
        })
    }
}