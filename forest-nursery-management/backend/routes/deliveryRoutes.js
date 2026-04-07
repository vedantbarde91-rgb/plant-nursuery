const express = require('express');
const router = express.Router();
const { getDeliveries, addDelivery, updateDelivery, deleteDelivery } = require('../controllers/deliveryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getDeliveries);
router.post('/', protect, addDelivery);
router.put('/:id', protect, updateDelivery);
router.delete('/:id', protect, deleteDelivery);

module.exports = router;
