const express = require('express');
const router = express.Router();
const swapsController = require('../controllers/swaps');

router.get('/', swapsController.getAllSwaps);
router.get('/:swapId', swapsController.getSwap);
router.post('/', swapsController.createSwap);
router.put('/:swapId', swapsController.updateSwap);
router.delete('/:swapId', swapsController.deleteSwap);

module.exports = router;

