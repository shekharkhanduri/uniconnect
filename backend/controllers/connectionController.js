// controllers/connectionController.js

const asyncHandler = require('express-async-handler');
const Connection = require('../models/connectionModel');
const User = require('../models/userModel');

// @desc    Send connection request
// @route   POST /api/connections/send/:userId
// @access  Protected
const sendConnectionRequest = asyncHandler(async (req, res) => {
    const senderId = req.user.id; // From JWT token
    const receiverId = req.params.userId;
    
    // Validate: Can't send request to yourself
    if (senderId === receiverId) {
        return res.status(400).json({
            success: false,
            message: 'Cannot send connection request to yourself'
        });
    }
    
    // Check if receiver exists
    const receiver = await User.findById(receiverId);
    if (!receiver) {
        return res.status(404).json({
            success: false,
            message: 'User not found'
        });
    }
    
    // Check if connection already exists (any status)
    const existingConnection = await Connection.findOne({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId }
        ]
    });
    
    if (existingConnection) {
        if (existingConnection.status === 'accepted') {
            return res.status(400).json({
                success: false,
                message: 'Already connected with this user'
            });
        } else if (existingConnection.status === 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Connection request already sent'
            });
        }
    }
    
   
    const connection = await Connection.create({
        sender: senderId,
        receiver: receiverId,
        status: 'pending'
    });
    
    await connection.populate('sender', 'name email profilePicture');
    await connection.populate('receiver', 'name email profilePicture');
    
    res.status(201).json({
        success: true,
        message: 'Connection request sent successfully',
        connection
    });
});

// @desc    Accept connection request
// @route   PUT /api/connections/accept/:connectionId
// @access  Protected
const acceptConnectionRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const connectionId = req.params.connectionId;
    
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
        return res.status(404).json({
            success: false,
            message: 'Connection request not found'
        });
    }
 
    if (connection.receiver.toString() !== userId) {
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to accept this request'
        });
    }
 
    if (connection.status === 'accepted') {
        return res.status(400).json({
            success: false,
            message: 'Connection request already accepted'
        });
    }
    

    connection.status = 'accepted';
    await connection.save();
    
    await connection.populate('sender', 'name email profilePicture');
    await connection.populate('receiver', 'name email profilePicture');
    
    res.status(200).json({
        success: true,
        message: 'Connection request accepted',
        connection
    });
});

// @desc    Reject connection request
// @route   PUT /api/connections/reject/:connectionId
// @access  Protected
const rejectConnectionRequest = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const connectionId = req.params.connectionId;
    
    const connection = await Connection.findById(connectionId);
    
    if (!connection) {
        return res.status(404).json({
            success: false,
            message: 'Connection request not found'
        });
    }
    
    // Only receiver can reject
    if (connection.receiver.toString() !== userId) {
        return res.status(403).json({
            success: false,
            message: 'You are not authorized to reject this request'
        });
    }
    
    await Connection.findByIdAndDelete(connectionId);
    
    res.status(200).json({
        success: true,
        message: 'Connection request rejected'
    });
});

// @desc    Get all my connections (accepted only)
// @route   GET /api/connections/my-connections
// @access  Protected
const getMyConnections = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Find all accepted connections where user is sender or receiver
    const connections = await Connection.find({
        $or: [
            { sender: userId, status: 'accepted' },
            { receiver: userId, status: 'accepted' }
        ]
    })
    .populate('sender', 'name email profilePicture bio education skills')
    .populate('receiver', 'name email profilePicture bio education skills')
    .sort({ updatedAt: -1 });
    
    // Format response: return the OTHER user in each connection
    const formattedConnections = connections.map(conn => {
        const isUserSender = conn.sender._id.toString() === userId;
        const connectedUser = isUserSender ? conn.receiver : conn.sender;
        
        return {
            connectionId: conn._id,
            connectedAt: conn.updatedAt,
            user: connectedUser
        };
    });
    
    res.status(200).json({
        success: true,
        count: formattedConnections.length,
        connections: formattedConnections
    });
});

// @desc    Get pending requests (received)
// @route   GET /api/connections/pending
// @access  Protected
const getPendingRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Find requests where I'm the receiver and status is pending
    const pendingRequests = await Connection.find({
        receiver: userId,
        status: 'pending'
    })
    .populate('sender', 'name email profilePicture bio education skills')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: pendingRequests.length,
        requests: pendingRequests
    });
});

// @desc    Get sent requests
// @route   GET /api/connections/sent
// @access  Protected
const getSentRequests = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    
    // Find requests where I'm the sender and status is pending
    const sentRequests = await Connection.find({
        sender: userId,
        status: 'pending'
    })
    .populate('receiver', 'name email profilePicture bio education skills')
    .sort({ createdAt: -1 });
    
    res.status(200).json({
        success: true,
        count: sentRequests.length,
        requests: sentRequests
    });
});

// @desc    Remove/unfriend a connection
// @route   DELETE /api/connections/remove/:userId
// @access  Protected
const removeConnection = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.params.userId;
    
    // Find the connection (could be in either direction)
    const connection = await Connection.findOne({
        $or: [
            { sender: userId, receiver: targetUserId, status: 'accepted' },
            { sender: targetUserId, receiver: userId, status: 'accepted' }
        ]
    });
    
    if (!connection) {
        return res.status(404).json({
            success: false,
            message: 'Connection not found'
        });
    }
    
    // Delete the connection
    await Connection.findByIdAndDelete(connection._id);
    
    res.status(200).json({
        success: true,
        message: 'Connection removed successfully'
    });
});

// @desc    Check connection status with a specific user
// @route   GET /api/connections/status/:userId
// @access  Protected
const getConnectionStatus = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const targetUserId = req.params.userId;
    
    if (userId === targetUserId) {
        return res.status(200).json({
            success: true,
            status: 'self'
        });
    }
    
    // Check if any connection exists
    const connection = await Connection.findOne({
        $or: [
            { sender: userId, receiver: targetUserId },
            { sender: targetUserId, receiver: userId }
        ]
    });
    
    if (!connection) {
        return res.status(200).json({
            success: true,
            status: 'none' // No connection
        });
    }
    
    // Determine the relationship
    let relationshipStatus = connection.status; // 'pending', 'accepted', 'rejected'
    let direction = null;
    
    if (connection.status === 'pending') {
        // Check who sent the request
        if (connection.sender.toString() === userId) {
            direction = 'sent'; // I sent the request
        } else {
            direction = 'received'; // I received the request
        }
    }
    
    res.status(200).json({
        success: true,
        status: relationshipStatus,
        direction,
        connectionId: connection._id
    });
});

module.exports = {
    sendConnectionRequest,
    acceptConnectionRequest,
    rejectConnectionRequest,
    getMyConnections,
    getPendingRequests,
    getSentRequests,
    removeConnection,
    getConnectionStatus
};