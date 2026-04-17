const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getExercises, getExerciseById,
  getWorkoutPlans, getWorkoutPlanById, createWorkoutPlan, updateWorkoutPlan, deleteWorkoutPlan,
  startWorkout, completeWorkout, getWorkoutHistory, getSmartSuggestions,
} = require('../controllers/workoutController');

// Exercises
router.get('/exercises', auth, getExercises);
router.get('/exercises/:id', auth, getExerciseById);

// Workout Plans
router.get('/plans', auth, getWorkoutPlans);
router.get('/plans/:id', auth, getWorkoutPlanById);
router.post('/plans', auth, createWorkoutPlan);
router.put('/plans/:id', auth, updateWorkoutPlan);
router.delete('/plans/:id', auth, deleteWorkoutPlan);

// Workout Logs
router.post('/start', auth, startWorkout);
router.put('/complete/:logId', auth, completeWorkout);
router.get('/history', auth, getWorkoutHistory);

// AI Suggestions
router.get('/suggestions', auth, getSmartSuggestions);

module.exports = router;
