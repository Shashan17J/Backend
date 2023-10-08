const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({

    gender: {
        type:String,
    },
    dateofBirth: {
        type: String,
    },
    about: {
        type:String,
        required:true,
    },
    contactNumber: {
        type:Number,
        trim:true,
    }
});

module.exports = mongoose.model("Profile", profileSchema);