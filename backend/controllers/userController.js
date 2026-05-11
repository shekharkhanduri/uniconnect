const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const { uploadToCloudinary,deleteFromCloudinary } = require('../services/cloudService');
//get all users (feed);
//GET /api/user

const getAllUser = async(req,res)=>{
    try{
        const user = await User.find();
        res.status(201).json(user);

    }
    catch(err){
        res.sendStatus(400);
    }
    
}

//get info of user with id
//GET /api/user/:id

const getUserById =asyncHandler(async (req,res)=>{
    
    const user = await User.findOne({"_id":req.params.id});
    if(!user){
        res.status(400).json({message:"Cannot find user with given id"});
    }
    res.status(201).json(user);
});



//delete user with id
//DELETE /api/user/:id
const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Ensure user can only delete their own account
    if (req.user.id !== id) {
        res.status(403);
        throw new Error("You can only delete your own account");
    }
    
    const deletedUser = await User.findByIdAndDelete(id);
    
    if (!deletedUser) {
        res.status(404);
        throw new Error("User not found");
    }
    
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});


//update the user information with id
//PATCH /api/user/:id

const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    if (req.user.id !== id) {
        res.status(403);
        throw new Error("You can only update your own profile");
    }
    
    const updateData = { ...req.body };
    
    // Parse JSON stringified fields from FormData (if sent as FormData)
    try {
        if (req.body.education && typeof req.body.education === 'string') {
            updateData.education = JSON.parse(req.body.education);
        }
        if (req.body.skills && typeof req.body.skills === 'string') {
            updateData.skills = JSON.parse(req.body.skills);
        }
        if (req.body.socialLinks && typeof req.body.socialLinks === 'string') {
            updateData.socialLinks = JSON.parse(req.body.socialLinks);
        }
    } catch (error) {
        res.status(400);
        throw new Error("Invalid JSON format for education, skills, or socialLinks");
    }
    
    // Handle profile picture upload if file is present
    if (req.file) {
        const fileName = `profile_${id}_${Date.now()}${req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))}`;
        const cloudLink = await uploadToCloudinary(
                req.file.buffer, 
                fileName,
                {
                    folder: 'profile-pictures', // Organize in a specific folder
                    mimetype: req.file.mimetype
                }
            );
        
        // Delete old profile picture from Cloudinary
        const oldUser = await User.findById(id);
        if (oldUser && oldUser.profilePicture) {
            try {
                await deleteFromCloudinary(oldUser.profilePicture);
            } catch (error) {
                console.log('Could not delete old profile picture');
            }
        }
        
        updateData.profilePicture = cloudLink;
    }
    
    const updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');
    
    if (!updatedUser) {
        res.status(404);
        throw new Error("User not found");
    }
    
    res.status(200).json({
        success: true,
        user: updatedUser
    });
});

module.exports = {getAllUser, deleteUser, updateUser,getUserById};