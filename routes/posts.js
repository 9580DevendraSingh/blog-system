const express = require('express');
const { 
    createPost, 
    getPosts, 
    getPost, 
    updatePost, 
    deletePost 
} = require('../controllers/postController');
const { auth, authorize } = require('../middleware/auth');
const { validatePost } = require('../middleware/validation');

const router = express.Router();

// ✅ SAHI ROUTE PATHS
router.route('/')
    .get(getPosts)
    .post(auth, validatePost, createPost);

router.route('/:id')
    .get(getPost)
    .put(auth, validatePost, updatePost)
    .delete(auth, deletePost);

module.exports = router;