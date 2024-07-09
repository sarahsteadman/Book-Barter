const express = require('express');
const { isLoggedOn, isCreator } = require('../middlewares/auth')
const router = express.Router();
const swapsController = require('../controllers/swaps');

router.get('/', swapsController.getAllSwaps);
router.get('/:swapId', swapsController.getSwap);
router.post('/', swapsController.createSwap);
router.put('/:swapId', isLoggedOn, isCreator, swapsController.updateSwap);
router.delete('/:swapId', swapsController.deleteSwap);

module.exports = router;

