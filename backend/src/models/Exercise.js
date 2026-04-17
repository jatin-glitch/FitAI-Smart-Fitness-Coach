const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: '' },
  muscleGroup: {
    type: String,
    enum: ['chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'full_body', 'cardio'],
    required: true,
  },
  equipment: {
    type: String,
    enum: ['none', 'dumbbells', 'barbell', 'machine', 'bands', 'kettlebell', 'bodyweight'],
    default: 'bodyweight',
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  caloriesPerMinute: { type: Number, default: 5 },
  imageUrl: { type: String, default: null },
  animationUrl: { type: String, default: null },
  instructions: [{ type: String }],
  tips: [{ type: String }],
  targetMuscles: [{ type: String }],
  isCompound: { type: Boolean, default: false },
});

exerciseSchema.index({ muscleGroup: 1, difficulty: 1 });
exerciseSchema.index({ name: 'text' });

module.exports = mongoose.model('Exercise', exerciseSchema);
