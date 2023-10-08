const Course = require('../models/Course');
const Tag = require("../models/category");
const User = require("../models/User");
const {uploadImageToCloudinary} = require("../utils/imageUploader");
require('dotenv').config();


// createCourse handler funtion
exports.createCourse = async (req, res) => {
    try {
        // fetch data
        const {courseName, courseDescription, whatYouWillLearn, price, tag} = req.body;

        // get thumbnail
        const thumbnail = req.files.thumbnailImage;

        // validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !ta || !thumbnail) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            })
        }

        // check for instructor inside DB
        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details", instructorDetails);

        if(!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:'Instructor Details not found',
            })
        }

        // check given tag is valid or not
        const tagDetails = await Tag.findById(tag);
        if(!tagDetails) {
            return res.status(404).json({
                success:false,
                message:'Tag Details not found',
            })
        }

        // Upload Image top Cloudinary
        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        // create an entry for new Cloudinary
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn: whatYouWillLearn,
            price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
        })

        // add the new course to the user schema of Instructor
        await User.findOneAndUpdate(
            {_id: instructorDetails._id},  //find instructor(user) id
            {
                $push: {
                    courses: newCourse._id,
                }
            },
            {new:true},
        );

        // Update tag schema
        // return res
        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse,
        });

    } catch(error) {
        console.error(error);
        res.status(500).json({
            success:false,
            message:'Failed to create Course',
            error: error.message,
        })
    }
}


// getAllCourses handler 

exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {courseName:true,
                                                  price:true,
                                                  thumbnail:true,
                                                  instructor:true,
                                                  ratingAndReviews:true,
                                                  studentEnrolled:true,})
                                                  .poplulate("instructor")
                                                  .exec();
        return res.status(200).json({
            success:true,
            message:'Data for all courses fatched successfully',
            data:allCourses,
        })
    } catch(error) {
        res.status(500).json({
            success:false,
            message:'Failed Fetch course data',
            error: error.message,
        })
    }
}