const express = require('express');
const router = express.Router();
const comments = require('../controllers/comments');

router.get('/', comments.getAllComments);
router.get('/:commentId', comments.getComment);
router.post('/', comments.createComment);
router.put('/:commentId', comments.updateComment);
router.delete('/:commentId', comments.deleteComment);

module.exports = router;