const workoutService = require('../services/workoutService');

const getExercises = async (req, res, next) => {
  try {
    const result = await workoutService.getExercises(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getExerciseById = async (req, res, next) => {
  try {
    const exercise = await workoutService.getExerciseById(req.params.id);
    res.json({ exercise });
  } catch (error) {
    next(error);
  }
};

const getWorkoutPlans = async (req, res, next) => {
  try {
    const result = await workoutService.getWorkoutPlans({ ...req.query, userId: req.userId });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getWorkoutPlanById = async (req, res, next) => {
  try {
    const plan = await workoutService.getWorkoutPlanById(req.params.id);
    res.json({ plan });
  } catch (error) {
    next(error);
  }
};

const createWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await workoutService.createWorkoutPlan(req.userId, req.body);
    res.status(201).json({ plan });
  } catch (error) {
    next(error);
  }
};

const updateWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await workoutService.updateWorkoutPlan(req.userId, req.params.id, req.body);
    res.json({ plan });
  } catch (error) {
    next(error);
  }
};

const deleteWorkoutPlan = async (req, res, next) => {
  try {
    const result = await workoutService.deleteWorkoutPlan(req.userId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const startWorkout = async (req, res, next) => {
  try {
    const log = await workoutService.startWorkout(req.userId, req.body.workoutPlanId);
    res.status(201).json({ log });
  } catch (error) {
    next(error);
  }
};

const completeWorkout = async (req, res, next) => {
  try {
    const log = await workoutService.completeWorkout(req.userId, req.params.logId, req.body);
    res.json({ log });
  } catch (error) {
    next(error);
  }
};

const getWorkoutHistory = async (req, res, next) => {
  try {
    const result = await workoutService.getWorkoutHistory(req.userId, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getSmartSuggestions = async (req, res, next) => {
  try {
    const suggestions = await workoutService.getSmartSuggestions(req.userId);
    res.json(suggestions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExercises, getExerciseById,
  getWorkoutPlans, getWorkoutPlanById, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan,
  startWorkout, completeWorkout, getWorkoutHistory, getSmartSuggestions,
};
