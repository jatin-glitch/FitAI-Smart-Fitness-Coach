const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'fruits', 'vegetables', 'grains', 'protein', 'dairy',
        'nuts_seeds', 'beverages', 'snacks', 'fast_food', 'other',
      ],
      required: true,
    },
    calories: { type: Number, required: true }, // per serving
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
    servingSize: { type: Number, default: 100 },
    servingUnit: { type: String, default: 'g' },
    isCommon: { type: Boolean, default: true },
  },
  { timestamps: true }
);

foodItemSchema.index({ name: 'text' });
foodItemSchema.index({ category: 1 });

module.exports = mongoose.model('FoodItem', foodItemSchema);
