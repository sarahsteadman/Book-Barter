const { body, param } = require('express-validator');

const bookValidationRules = () => {
    return [
        body('title')
            .isString().withMessage('Title must be a string')
            .notEmpty().withMessage('Title is required')
            .isLength({ min: 1, max: 100 }).withMessage('Title must be between 1 and 100 characters'),

        body('author')
            .isString().withMessage('Author must be a string')
            .isLength({ min: 1, max: 255 }).withMessage('Author must be between 1 and 255 characters'),
        body('description')
            .isString().withMessage('Description must be a string')
            .isLength({ min: 1, max: 3000 }).withMessage('Description must be between 1 and 3000 characters'),
        body('condition')
            .isString().withMessage('Condition must be a string')
            .notEmpty().withMessage('Condition is required')
            .isLength({ min: 1, max: 255 }).withMessage('Condition must be between 1 and 255 characters'),

        body('ISBN')
            .isInt({ gt: -1 }).withMessage('ISBN must be an integer greater than or equal to 0')
            .isLength({ min: 10, max: 13 }).withMessage('ISBN must be between 10 and 13 characters')
            .notEmpty().withMessage('ISBN is required'),
        body('swap')
            .notEmpty().withMessage('swap is required'),

    ];
};
const addBookValidationRules = () => {
    return [

        body('condition')
            .isString().withMessage('Condition must be a string')
            .notEmpty().withMessage('Condition is required')
            .isLength({ min: 1, max: 255 }).withMessage('Condition must be between 1 and 255 characters'),

        body('ISBN')
            .isInt({ gt: -1 }).withMessage('ISBN must be an integer greater than or equal to 0')
            .isLength({ min: 10, max: 13 }).withMessage('ISBN must be between 10 and 13 characters')
            .notEmpty().withMessage('ISBN is required'),
        body('swap')
            .notEmpty().withMessage('swap is required'),

    ];
};

const idValidationRules = () => {
    return [
        param('bookId')
            .isMongoId().withMessage('Invalid ID format')
    ];
};

module.exports = {
    bookValidationRules, idValidationRules, addBookValidationRules
};
