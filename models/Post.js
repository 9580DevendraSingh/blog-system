const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    body: {
        type: String,
        required: [true, 'Body content is required']
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    tags: [{
        type: String,
        trim: true
    }],
    categories: [{
        type: String,
        trim: true
    }],
    isPublished: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Add text index for search functionality
postSchema.index({ title: 'text', body: 'text', tags: 'text' });

module.exports = mongoose.model('Post', postSchema);