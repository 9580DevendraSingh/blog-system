const Post = require('../models/Post');
const Comment = require('../models/Comment');

// Create post
exports.createPost = async (req, res) => {
    try {
        const { title, body, tags, categories } = req.body;
        
        const post = await Post.create({
            title,
            body,
            author: req.user.id,
            tags: tags || [],
            categories: categories || []
        });

        await post.populate('author', 'username email');

        res.status(201).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all posts
exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search, tag } = req.query;
        
        let query = { isPublished: true };
        
        // Search functionality
        if (search) {
            query.$text = { $search: search };
        }
        
        // Filter by tag
        if (tag) {
            query.tags = { $in: [tag] };
        }

        const posts = await Post.find(query)
            .populate('author', 'username email')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Post.countDocuments(query);

        res.json({
            success: true,
            posts,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single post
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'username email');
            
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update post
exports.updatePost = async (req, res) => {
    try {
        let post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership or admin role
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        post = await Post.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('author', 'username email');

        res.json({ success: true, post });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete post
exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Check ownership or admin role
        if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Delete associated comments
        await Comment.deleteMany({ postID: req.params.id });
        
        await Post.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};