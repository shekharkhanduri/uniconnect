const cloudinary = require('../config/cloudinary');

// Upload file to Cloudinary and return public link
const uploadToCloudinary = async (fileBuffer, fileName, options = {}) => {
    try {
        // Convert buffer to base64
        const fileBase64 = `data:${options.mimetype || 'image/jpeg'};base64,${fileBuffer.toString('base64')}`;
        
        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: options.folder || 'uploads',
            public_id: options.publicId || fileName.split('.')[0],
            resource_type: 'auto',
            ...options
        });
        
        return {
            url: result.secure_url,
            publicId: result.public_id,
            format: result.format,
            resourceType: result.resource_type
        };
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw new Error('Failed to upload file to Cloudinary');
    }
};

// Delete file from Cloudinary
const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType
        });
        
        if (result.result !== 'ok') {
            throw new Error('File not found or already deleted');
        }
        
        return true;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw new Error('Failed to delete file from Cloudinary');
    }
};

module.exports = {
    uploadToCloudinary,
    deleteFromCloudinary
};