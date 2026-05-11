const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require('../services/cloudService');

// @desc    Register new user with optional profile picture
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, bio } = req.body;
    
    // Parse JSON fields from frontend
    let education = {};
    let skills = [];
    let socialLinks = {};
    
    try {
        if (req.body.education) {
            education = JSON.parse(req.body.education);
        }
        if (req.body.skills) {
            skills = JSON.parse(req.body.skills);
        }
        if (req.body.socialLinks) {
            socialLinks = JSON.parse(req.body.socialLinks);
        }
    } catch (error) {
        res.status(400);
        throw new Error("There was an error processing your information. Please check your input and try again.");
    }
    
    // Validate required fields
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill in all required fields: Name, Email, and Password");
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        res.status(400);
        throw new Error("An account with this email already exists. Please try logging in instead.");
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Handle profile picture upload if provided
    let profilePictureUrl = '';
    let profilePicturePublicId = ''; // Store this for future deletion
    
    if (req.file) {
        try {
            // Generate unique filename
            const fileName = `profile_${Date.now()}_${req.file.originalname}`;
            
            // Upload to Cloudinary
            const uploadResult = await uploadToCloudinary(
                req.file.buffer, 
                fileName,
                {
                    folder: 'profile-pictures', 
                    mimetype: req.file.mimetype
                }
            );
            
            profilePictureUrl = uploadResult.url;
            profilePicturePublicId = uploadResult.publicId;
            
            console.log('✅ Profile picture uploaded to Cloudinary:', profilePictureUrl);
        } catch (error) {
            console.error('❌ Cloudinary upload failed during registration:', error);
        }
    }
    
    // Create user with all fields from the User model
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        bio: bio || '',
        profilePicture: profilePictureUrl,
        education: {
            university: education.university || '',
            course: education.course || '',
            year: education.year || '',
            graduationYear: education.graduationYear || undefined
        },
        skills: skills.length > 0 ? skills : [],
        socialLinks: {
            github: socialLinks.github || '',
            linkedin: socialLinks.linkedin || '',
            portfolio: socialLinks.portfolio || ''
        },
        isActive: true,
        isVerified: false
    });
    
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    
    // Return user without password - including all new fields
    const userResponse = {
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePicture: user.profilePicture,
        education: user.education,
        skills: user.skills,
        socialLinks: user.socialLinks,
        isActive: user.isActive,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    };
    
    res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        user: userResponse
    });
});
//login user
//POST /api/user/login
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Please enter both email and password'
        });
    }
    
    // Find user with password field
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
        return res.status(400).json({
            success: false,
            message: 'No account found with this email. Please check your email or sign up for a new account.'
        });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
        return res.status(400).json({
            success: false,
            message: 'Incorrect password. Please try again or reset your password.'
        });
    }
    // Generate JWT token
    const token = jwt.sign(
        { id: user._id, email: user.email, name: user.name, profilePicture: user.profilePicture},
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    );
    
    // Return success response
    res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            bio: user.bio,
            education: user.education,
            skills: user.skills,
            socialLinks: user.socialLinks,
            profilePicture: user.profilePicture
        }
    });
});

//get current user 
//GET /api/user/current

const currentUser =asyncHandler(async (req, res) => {
    res.json(req.user);
});


module.exports = { registerUser, loginUser, currentUser};
