const express = require('express');
const router = express.Router();
const { getSites, addSite, updateSite, deleteSite } = require('../controllers/siteController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, getSites);
router.post('/', protect, addSite);
router.put('/:id', protect, updateSite);
router.delete('/:id', protect, deleteSite);

module.exports = router;
