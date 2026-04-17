const mongoose = require('mongoose');

const workoutExerciseSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  sets: { type: Number, default: 3 },
  reps: { type: Number, default: 12 },
  duration: { type: Number, default: null }, // seconds (for timed exercises)
  restTime: { type: Number, default: 60 }, // seconds
  weight: { type: Number, default: null }, // kg
  order: { type: Number, required: true },
});

const workoutPlanSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      enum: ['strength', 'cardio', 'hiit', 'yoga', 'stretching', 'full_body', 'custom'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'intermediate',
    },
    duration: { type: Number, required: true }, // estimated minutes
    caloriesBurn: { type: Number, default: 0 }, // estimated
    imageUrl: { type: String, default: null },
    exercises: [workoutExerciseSchema],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    isSystem: { type: Boolean, default: false },
    targetMuscles: [{ type: String }],
    tags: [{ type: String }],
  },
  { timestamps: true }
);

workoutPlanSchema.index({ category: 1, difficulty: 1 });
workoutPlanSchema.index({ creator: 1 });
workoutPlanSchema.index({ isSystem: 1 });

module.exports = mongoose.model('WorkoutPlan', workoutPlanSchema);
