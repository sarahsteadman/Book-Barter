const express = require('express');
const { isLoggedOn } = require('../middlewares/auth')
const router = express.Router();
const swapsController = require('../controllers/swaps');

router.get('/', swapsController.getAllSwaps);
router.get('/:swapId', swapsController.getSwap);
router.post('/', swapsController.createSwap);
router.put('/:swapId', isLoggedOn, swapsController.updateSwap);
router.delete('/:swapId', isLoggedOn, swapsController.deleteSwap);

module.exports = router;

