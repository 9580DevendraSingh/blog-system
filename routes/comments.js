const express = require('express');
const {
    createComment,
    getComments,
    updateComment,
    deleteComment
} = require('../controllers/commentController');
const { auth } = require('../middleware/auth');

const router = express.Router();

// ✅ SAHI ROUTE PATHS
router.route('/:postId')
    .get(getComments)
    .post(auth, createComment);

router.route('/:id')
    .put(auth, updateComment)
    .delete(auth, deleteComment);

module.exports = router;