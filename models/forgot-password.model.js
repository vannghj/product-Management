const mongoose = require("mongoose");
const generate = require("../helpers/generate");
const forgotPasswordSchema = new mongoose.Schema(
    {
        email:String,
        otp: String,
        "expiresAt": {
            type: Date,
            expires: 180*1000
        }

    }, {
        timestamps: true
    });

const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema, "forgot-password");

module.exports = ForgotPassword;