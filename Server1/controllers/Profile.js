const Profile = require('../models/Profile');
const User = require('../models/User');

exports.updateProfile = async (req, res) => {
    try{
        // get data
        const {dateOfBirth="", about="", contactNumber="", gender} = req.body;

        // get userId
        const id = req.user.id;

        // validation
        if(!contactNumber || !gender || !id) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        // find profile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        // update profile
        profileDetails.dateofBirth = dateofBirth;
        profileDetails.about = about;
        profileDetails.gender = gender;
        profileDetails.contactNumber = contactNumber;

        // update profile data in db.
        await profileDetails.save();

        // return response
        return res.status(200).json({
            success:true,
            message:'Profile Update Successfully',
            profileDetails,
        })
    } catch(error) {
        return res.status(500).json({
            success:true,
            error:error.message,
        })
    }
}


// delete Profile/User Account
// Explore: how can we schedule the deletion operation

exports.deleteAccount = async (req, res) => {
    try{
        // get Id
        const id = req.user.id;

        // validation
        const userDetails = await User.findById(id);
        if(!userDetails) {
            return res.status(404).json({
                success:false,
                message:'User not found',
            })
        }

        // delete profile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});

        // ToDo: unroll user from all enrolled courses
        // delete user
        await User.findOneAndDelete({_id:id});

        //return response
        return res.status(200).json({
            success:true,
            message:'User Deleted Successfully',
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'User cannot be deleted successfully',
        })
    }
};

exports.getAllUserDetails = async (req,res) => {
    try {
        // get Id
        const id = req.user.id;

        // validation and get user details
        const userDetails = await User.findById(id).populate("additionalDetails").exec();

        // return response
        return res.status(200).json({
            success:true,
            message:"User Data Fetched Successfully",
            userDetails,
        });
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}