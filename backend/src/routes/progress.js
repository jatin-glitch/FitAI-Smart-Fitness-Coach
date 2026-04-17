const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getDailyLog, updateDailyLog, getWeeklyStats, getMonthlyStats, getStreak, getAIInsights,
} = require('../controllers/progressController');

router.get('/daily/:date?', auth, getDailyLog);
router.put('/daily/:date', auth, updateDailyLog);
router.get('/weekly', auth, getWeeklyStats);
router.get('/monthly', auth, getMonthlyStats);
router.get('/streak', auth, getStreak);
router.get('/insights', auth, getAIInsights);

module.exports = router;
