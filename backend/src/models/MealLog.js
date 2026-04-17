const mongoose = require('mongoose');

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  calories: { type: Number, required: true },
  protein: { type: Number, default: 0 }, // grams
  carbs: { type: Number, default: 0 }, // grams
  fat: { type: Number, default: 0 }, // grams
  fiber: { type: Number, default: 0 }, // grams
  quantity: { type: Number, default: 1 },
  unit: { type: String, default: 'serving' },
});

const mealLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    mealType: {
      type: String,
      enum: ['breakfast', 'lunch', 'dinner', 'snack'],
      required: true,
    },
    items: [mealItemSchema],
    totalCalories: { type: Number, default: 0 },
    totalProtein: { type: Number, default: 0 },
    totalCarbs: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

mealLogSchema.index({ user: 1, date: -1 });

mealLogSchema.pre('save', function (next) {
  this.totalCalories = this.items.reduce((sum, item) => sum + item.calories * item.quantity, 0);
  this.totalProtein = this.items.reduce((sum, item) => sum + item.protein * item.quantity, 0);
  this.totalCarbs = this.items.reduce((sum, item) => sum + item.carbs * item.quantity, 0);
  this.totalFat = this.items.reduce((sum, item) => sum + item.fat * item.quantity, 0);
  next();
});

module.exports = mongoose.model('MealLog', mealLogSchema);
