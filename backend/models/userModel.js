// src/models/User.js

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    
    // Profile Information
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters'],
      default: ''
    },
    
    profilePicture: {
      type: String,
      default: '' // URL or path to uploaded image
    },
    
    // Education
    education: {
      university: {
        type: String,
        trim: true,
        default: ''
      },
      course: {
        type: String,
        trim: true,
        default: ''
      },
      year: {
        type: String, // e.g., "1st Year", "2nd Year", "Final Year"
        default: ''
      },
      graduationYear: {
        type: Number,
        min: 2020,
        max: 2030
      }
    },
    
    // Skills
    skills: [{
      type: String,
      trim: true
    }],
    
    // Social Links (optional)
    socialLinks: {
      github: {
        type: String,
        default: ''
      },
      linkedin: {
        type: String,
        default: ''
      },
      portfolio: {
        type: String,
        default: ''
      }
    },
    
    // Account Status
    isActive: {
      type: Boolean,
      default: true
    },
    
    isVerified: {
      type: Boolean,
      default: false // For email verification (future feature)
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
);

// Virtual for user's age or other computed fields (if needed)
// userSchema.virtual('fullProfile').get(function() {
//   return `${this.name} - ${this.education.course}`;
// });

module.exports = mongoose.model('User', userSchema);