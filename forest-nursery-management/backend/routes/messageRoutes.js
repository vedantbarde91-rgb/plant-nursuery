const express = require('express');
const router = express.Router();
const { getMessages, markRead, markAllRead, deleteMessage } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getMessages);
router.put('/:id/read', protect, markRead);
router.put('/read/all', protect, markAllRead);
router.delete('/:id', protect, deleteMessage);

module.exports = router;
