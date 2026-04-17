const mongoose = require('mongoose');

const dailyLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD format
    calories: {
      consumed: { type: Number, default: 0 },
      burned: { type: Number, default: 0 },
      goal: { type: Number, default: 2000 },
    },
    steps: {
      count: { type: Number, default: 0 },
      goal: { type: Number, default: 10000 },
    },
    water: {
      glasses: { type: Number, default: 0 },
      goal: { type: Number, default: 8 },
    },
    weight: { type: Number, default: null },
    workoutsCompleted: { type: Number, default: 0 },
    activeMinutes: { type: Number, default: 0 },
    mood: {
      type: String,
      enum: ['great', 'good', 'okay', 'tired', 'exhausted', null],
      default: null,
    },
  },
  { timestamps: true }
);

dailyLogSchema.index({ user: 1, date: -1 }, { unique: true });

module.exports = mongoose.model('DailyLog', dailyLogSchema);
