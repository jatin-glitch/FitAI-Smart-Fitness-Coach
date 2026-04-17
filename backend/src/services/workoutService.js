const WorkoutPlan = require('../models/WorkoutPlan');
const WorkoutLog = require('../models/WorkoutLog');
const Exercise = require('../models/Exercise');

class WorkoutService {
  // Exercise CRUD
  async getExercises({ muscleGroup, difficulty, search, page = 1, limit = 20 }) {
    const query = {};
    if (muscleGroup) query.muscleGroup = muscleGroup;
    if (difficulty) query.difficulty = difficulty;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;
    const [exercises, total] = await Promise.all([
      Exercise.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      Exercise.countDocuments(query),
    ]);

    return {
      exercises,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getExerciseById(id) {
    const exercise = await Exercise.findById(id);
    if (!exercise) {
      const error = new Error('Exercise not found.');
      error.statusCode = 404;
      throw error;
    }
    return exercise;
  }

  // Workout Plan CRUD
  async getWorkoutPlans({ category, difficulty, userId, isSystem, page = 1, limit = 20 }) {
    const query = {};
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    if (isSystem !== undefined) query.isSystem = isSystem;
    if (userId) query.$or = [{ creator: userId }, { isSystem: true }];

    const skip = (page - 1) * limit;
    const [plans, total] = await Promise.all([
      WorkoutPlan.find(query)
        .populate('exercises.exercise', 'name muscleGroup equipment imageUrl')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      WorkoutPlan.countDocuments(query),
    ]);

    return {
      plans,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async getWorkoutPlanById(id) {
    const plan = await WorkoutPlan.findById(id).populate('exercises.exercise');
    if (!plan) {
      const error = new Error('Workout plan not found.');
      error.statusCode = 404;
      throw error;
    }
    return plan;
  }

  async createWorkoutPlan(userId, planData) {
    const plan = new WorkoutPlan({ ...planData, creator: userId, isSystem: false });
    await plan.save();
    return plan;
  }

  async updateWorkoutPlan(userId, planId, updates) {
    const plan = await WorkoutPlan.findOne({ _id: planId, creator: userId });
    if (!plan) {
      const error = new Error('Workout plan not found or not authorized.');
      error.statusCode = 404;
      throw error;
    }
    Object.assign(plan, updates);
    await plan.save();
    return plan;
  }

  async deleteWorkoutPlan(userId, planId) {
    const plan = await WorkoutPlan.findOneAndDelete({ _id: planId, creator: userId, isSystem: false });
    if (!plan) {
      const error = new Error('Workout plan not found or not authorized.');
      error.statusCode = 404;
      throw error;
    }
    return { message: 'Workout plan deleted.' };
  }

  // Workout Logs
  async startWorkout(userId, workoutPlanId) {
    const log = new WorkoutLog({
      user: userId,
      workoutPlan: workoutPlanId || null,
      startTime: new Date(),
      exercises: [],
    });
    await log.save();
    return log;
  }

  async completeWorkout(userId, logId, data) {
    const log = await WorkoutLog.findOne({ _id: logId, user: userId });
    if (!log) {
      const error = new Error('Workout log not found.');
      error.statusCode = 404;
      throw error;
    }

    log.endTime = new Date();
    log.totalDuration = Math.round((log.endTime - log.startTime) / 60000);
    log.completed = true;
    if (data.exercises) log.exercises = data.exercises;
    if (data.caloriesBurned) log.caloriesBurned = data.caloriesBurned;
    if (data.rating) log.rating = data.rating;
    if (data.notes) log.notes = data.notes;

    await log.save();
    return log;
  }

  async getWorkoutHistory(userId, { page = 1, limit = 20 }) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      WorkoutLog.find({ user: userId })
        .populate('workoutPlan', 'name category')
        .sort({ startTime: -1 })
        .skip(skip)
        .limit(limit),
      WorkoutLog.countDocuments({ user: userId }),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  // Smart suggestions
  async getSmartSuggestions(userId) {
    const recentLogs = await WorkoutLog.find({ user: userId, completed: true })
      .populate('workoutPlan', 'category targetMuscles')
      .sort({ startTime: -1 })
      .limit(10);

    const muscleGroupCount = {};
    recentLogs.forEach((log) => {
      if (log.workoutPlan && log.workoutPlan.targetMuscles) {
        log.workoutPlan.targetMuscles.forEach((m) => {
          muscleGroupCount[m] = (muscleGroupCount[m] || 0) + 1;
        });
      }
    });

    const allMuscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];
    const neglected = allMuscleGroups
      .filter((m) => !muscleGroupCount[m] || muscleGroupCount[m] < 2)
      .slice(0, 3);

    const suggestedPlans = await WorkoutPlan.find({
      isSystem: true,
      targetMuscles: { $in: neglected.length > 0 ? neglected : allMuscleGroups },
    }).limit(5);

    return {
      neglectedMuscles: neglected,
      suggestedPlans,
      totalWorkoutsThisWeek: recentLogs.filter((l) => {
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return l.startTime >= weekAgo;
      }).length,
    };
  }
}

module.exports = new WorkoutService();
