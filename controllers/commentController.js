const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Create comment
exports.createComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const postID = req.params.postId;

        // Check if post exists
        const post = await Post.findById(postID);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const newComment = await Comment.create({
            postID,
            userID: req.user.id,
            comment
        });

        await newComment.populate('userID', 'username email');

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get comments for a post
exports.getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postID: req.params.postId })
            .populate('userID', 'username email')
            .sort({ createdAt: -1 });

        res.json({ success: true, comments });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update comment
exports.updateComment = async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership
        if (comment.userID.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Access denied' });
        }

        comment = await Comment.findByIdAndUpdate(
            req.params.id,
            { comment: req.body.comment },
            { new: true, runValidators: true }
        ).populate('userID', 'username email');

        res.json({ success: true, comment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check ownership or admin role
        if (comment.userID.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        await Comment.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Comment deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};