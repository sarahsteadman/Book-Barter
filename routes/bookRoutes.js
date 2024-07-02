const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');


router.get('/', bookController.getAllBooks);
router.get('/:bookId', bookController.getBookById);
router.post('/addBook', bookController.addBook);
router.put('/updateBook/:bookId', bookController.updateBook);
router.delete('/deleteBook/:bookId', bookController.deleteBook);

module.exports = router;