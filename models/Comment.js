const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    postID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    },
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comment: {
        type: String,
        required: [true, 'Comment is required'],
        trim: true,
        maxlength: [500, 'Comment cannot exceed 500 characters']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);