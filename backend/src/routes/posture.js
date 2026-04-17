const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { analyzePosture } = require('../controllers/postureController');

router.post('/analyze', auth, analyzePosture);

module.exports = router;
