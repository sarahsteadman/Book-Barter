const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const validator = require('../validation/bookValidation')


router.get('/', bookController.getAllBooks);
router.get('/:bookId', validator.idValidationRules(), bookController.getBookById);
router.post('/addBook', validator.addBookValidationRules(), bookController.addBook);
router.put('/updateBook/:bookId', validator.idValidationRules(), validator.bookValidationRules(), bookController.updateBook);
router.delete('/deleteBook/:bookId', validator.idValidationRules(), bookController.deleteBook);

module.exports = router;