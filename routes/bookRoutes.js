const express = require('express');
const { isLoggedOn } = require('../middlewares/auth'); // Import the middleware

const router = express.Router();
const bookController = require('../controllers/bookController');
const validator = require('../validation/bookValidation')


router.get('/', bookController.getAllBooks);
router.get('/:bookId', validator.idValidationRules(), bookController.getBookById);
router.post('/addBook', isLoggedOn, validator.addBookValidationRules(), bookController.addBook);
router.put('/updateBook/:bookId', isLoggedOn, validator.idValidationRules(), validator.bookValidationRules(), bookController.updateBook);
router.delete('/deleteBook/:bookId', isLoggedOn, validator.idValidationRules(), bookController.deleteBook);

module.exports = router;