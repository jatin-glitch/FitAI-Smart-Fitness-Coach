const progressService = require('../services/progressService');

const getDailyLog = async (req, res, next) => {
  try {
    const log = await progressService.getDailyLog(req.userId, req.params.date);
    res.json({ log });
  } catch (error) {
    next(error);
  }
};

const updateDailyLog = async (req, res, next) => {
  try {
    const log = await progressService.updateDailyLog(req.userId, req.params.date, req.body);
    res.json({ log });
  } catch (error) {
    next(error);
  }
};

const getWeeklyStats = async (req, res, next) => {
  try {
    const stats = await progressService.getWeeklyStats(req.userId);
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getMonthlyStats = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const stats = await progressService.getMonthlyStats(req.userId, Number(month), Number(year));
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

const getStreak = async (req, res, next) => {
  try {
    const streak = await progressService.getStreak(req.userId);
    res.json({ streak });
  } catch (error) {
    next(error);
  }
};

const getAIInsights = async (req, res, next) => {
  try {
    const insights = await progressService.getAIInsights(req.userId);
    res.json({ insights });
  } catch (error) {
    next(error);
  }
};

module.exports = { getDailyLog, updateDailyLog, getWeeklyStats, getMonthlyStats, getStreak, getAIInsights };
