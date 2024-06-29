const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


// router.get('/:bookId', bookController.getBook);
router.post('/addBook', bookController.addBook);
// router.delete('/:bookId', bookController.deleteBook);

module.exports = router;