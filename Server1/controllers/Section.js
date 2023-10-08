const { request } = require('express');
const Section = require('../models/Section');
const Course = require("../models/Course");

exports.createSection = async (Req, res) => {
    try{
        // data fetch
        const {sectionName, courseId} = req.body;  //course id for update the course

        // data validation
        if(!sectionName || courseId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        // create section
        const newSection = await Section.create({sectionName});

        // update course with section ObjectId
        const updatedCourseDetails = await Course.findOneAndUpdate(
                                    courseId,
                                    {
                                        $push:{
                                            courseContent:newSection._id,
                                        }
                                    },
                                    {new:true},
        )
        // ToDo: use populate to repalce sections/sub-sections idFormat data both in the updatedCourseDetails

        // return response
        return res.status(200).json({
            success:true,
            message:'Section created successfully',
            updatedCourseDetails,
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Unable to create Section, please try again',
            error:error.message,
        })
    }
}


exports.updateSection = async (req,res) => {
    try {
        // data fetch
        const {sectionName, sectionId} = req.body;

        // data validation
        if(!sectionName || sectionId) {
            return res.status(400).json({
                success:false,
                message:'Missing Properties',
            });
        }

        // update data
        const section = await Section.findOneAndUpdate(sectionId, {sectionName}, {new:true});

        // return res 
        return res.status(200).json({
            success:true,
            message:'Section Update Successfully',
        });

    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Unable to update Section, please try again',
            error:error.message,
        });
    }
}

exports.deleteSection = async (req,res) => {
    try{
        // get Id - assuming thet we are sending ID in params
        const {sectionId} = req.params;

        // use findByIdandDelete
        await Section.findByIdAndDelete(sectionId);

        // return res
        return res.status(200).json({
            success:true,
            message:'Section Deleted Successfully',
        })
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Unable to delete Section, please try again',
            error:error.message,
        });
    }
}