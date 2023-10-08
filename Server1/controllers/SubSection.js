const SubSection = require("../models/SubSection");
const Section = require('../models/Section');
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require('dotenv').config();

// create Subsection

exports.createSubSection = async (req, res) => {
    try{
        // fetch data from req body
        // sectionId -> to find with section we have to insert sub-section
        const {sectionId, title, timeDuration, description} = req.body;

        // extract file/video
        const video = req.files.videoFile;

        // validation
        if(!sectionId || !title || !timeDuration || !description || !video) {
            return res.status(400).json({
                success:false,
                message:'All fields are required',
            });
        }
        // upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.StudyNotion);

        // create a sub-section
        const SubSectionDetails = await SubSection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.section_url,
        });

        // update section with sub section ObjectId
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                      {$push:{
                                                        subSection:SubSectionDetails._id,
                                                      }},
                                                      {new:true});
        
    //HW: log updated section here, after adding populate query   
    // return response
    return res.status(200).json({
        success:true,
        message:'Sub Section Created Successfully',
        updateSection,
    });
    } catch(error) {
        return res.status(500).json({
            success:false,
            message:'Internal Server Error',
            error:error.message,
        })
    }
};

// ToDo: UpdateSubSection

// ToDO: DeleteSubSection