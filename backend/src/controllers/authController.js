const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res) => {
  res.json({ user: req.user });
};

const updateProfile = async (req, res, next) => {
  try {
    const user = await authService.updateProfile(req.userId, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const updatePreferences = async (req, res, next) => {
  try {
    const user = await authService.updatePreferences(req.userId, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

const completeOnboarding = async (req, res, next) => {
  try {
    const user = await authService.completeOnboarding(req.userId);
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile, updatePreferences, completeOnboarding };
