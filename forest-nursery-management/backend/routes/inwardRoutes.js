const express = require('express');
const router = express.Router();
const { getInward, addInward, deleteInward } = require('../controllers/inwardController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getInward);
router.post('/', protect, addInward);
router.delete('/:id', protect, deleteInward);

module.exports = router;
