const express = require('express');
const userRoutes = require('./userRoutes');
//const commentRoutes = require('./commentRoutes');
//const bookRoutes = require('./bookRoutes');
//const swapRoutes = require('./swapRoutes');
const router = express.Router();

router.use('/users', userRoutes);
//router.use('/comments', commentRoutes);
//router.use('/books', bookRoutes);
//router.use('/swaps', swapRoutes);

module.exports = router;