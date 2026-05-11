// models/Connection.js

const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema(
  {
    // Who sent the request
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Who received the request
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    
    // Request status
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  },
  {
    timestamps: true // createdAt, updatedAt
  }
);

// Compound index - prevent duplicate requests
connectionSchema.index({ sender: 1, receiver: 1 }, { unique: true });


module.exports = mongoose.model('Connection', connectionSchema);
