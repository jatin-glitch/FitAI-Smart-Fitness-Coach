const mongoose = require('mongoose');

const exerciseLogSchema = new mongoose.Schema({
  exercise: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
  setsCompleted: { type: Number, default: 0 },
  repsCompleted: [{ type: Number }],
  weightUsed: [{ type: Number }],
  duration: { type: Number, default: 0 }, // seconds
});

const workoutLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    workoutPlan: { type: mongoose.Schema.Types.ObjectId, ref: 'WorkoutPlan', default: null },
    exercises: [exerciseLogSchema],
    startTime: { type: Date, required: true },
    endTime: { type: Date, default: null },
    totalDuration: { type: Number, default: 0 }, // minutes
    caloriesBurned: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    rating: { type: Number, min: 1, max: 5, default: null },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

workoutLogSchema.index({ user: 1, createdAt: -1 });
workoutLogSchema.index({ user: 1, startTime: -1 });

module.exports = mongoose.model('WorkoutLog', workoutLogSchema);
