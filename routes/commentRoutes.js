const express = require('express');
const { isLoggedOn } = require('../middlewares/auth'); // Import the middleware
const router = express.Router();
const comments = require('../controllers/comments');

router.get('/', comments.getAllComments);
router.get('/:commentId', comments.getComment);
router.post('/', isLoggedOn, comments.createComment);
router.put('/:commentId', isLoggedOn, comments.updateComment);
router.delete('/:commentId', isLoggedOn, comments.deleteComment);

module.exports = router;