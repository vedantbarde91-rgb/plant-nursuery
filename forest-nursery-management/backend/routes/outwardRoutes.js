const express = require('express');
const router = express.Router();
const { getOutward, addOutward, deleteOutward } = require('../controllers/outwardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getOutward);
router.post('/', protect, addOutward);
router.delete('/:id', protect, deleteOutward);

module.exports = router;
