const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

// @desc    Search users by name
// @route   GET /api/search/users?query=john
// @access  Protected
const searchUsers = asyncHandler(async (req, res) => {
    const { query } = req.query;
    
    if (!query) {
        res.status(400);
        throw new Error("Search query is required");
    }
    
    const users = await User.find({
        name: { $regex: query, $options: 'i' } // Case-insensitive search
    }).select('-password');
    
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

// @desc    Search users by skill
// @route   GET /api/search/skills?skill=react
// @access  Protected
const searchBySkill = asyncHandler(async (req, res) => {
    const { skill } = req.query;
    
    if (!skill) {
        res.status(400);
        throw new Error("Skill parameter is required");
    }
    
    const users = await User.find({
        skills: { $regex: skill, $options: 'i' }
    }).select('-password');
    
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

// @desc    Search users by course
// @route   GET /api/search/course?course=computer
// @access  Protected
const searchByCourse = asyncHandler(async (req, res) => {
    const { course } = req.query;
    
    if (!course) {
        res.status(400);
        throw new Error("Course parameter is required");
    }
    
    const users = await User.find({
        'education.course': { $regex: course, $options: 'i' }
    }).select('-password');
    
    res.status(200).json({
        success: true,
        count: users.length,
        users
    });
});

module.exports = {
    searchUsers,
    searchBySkill,
    searchByCourse
};