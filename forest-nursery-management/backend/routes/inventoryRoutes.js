const express = require('express');
const router = express.Router();
const { getPlants, addPlant, updatePlant, deletePlant } = require('../controllers/inventoryController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getPlants);
router.post('/', protect, addPlant);
router.put('/:id', protect, updatePlant);
router.delete('/:id', protect, deletePlant);

module.exports = router;
