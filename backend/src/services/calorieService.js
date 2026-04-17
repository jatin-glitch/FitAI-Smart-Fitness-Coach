const MealLog = require('../models/MealLog');
const FoodItem = require('../models/FoodItem');
const DailyLog = require('../models/DailyLog');
const { getDateString } = require('../utils/helpers');

class CalorieService {
  // Food database
  async searchFoods({ search, category, page = 1, limit = 20 }) {
    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const skip = (page - 1) * limit;
    const [foods, total] = await Promise.all([
      FoodItem.find(query).skip(skip).limit(limit).sort({ name: 1 }),
      FoodItem.countDocuments(query),
    ]);

    return { foods, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async getFoodCategories() {
    return [
      { id: 'fruits', name: 'Fruits', icon: 'apple' },
      { id: 'vegetables', name: 'Vegetables', icon: 'leaf' },
      { id: 'grains', name: 'Grains & Cereals', icon: 'grain' },
      { id: 'protein', name: 'Protein', icon: 'drumstick' },
      { id: 'dairy', name: 'Dairy', icon: 'cup' },
      { id: 'nuts_seeds', name: 'Nuts & Seeds', icon: 'seed' },
      { id: 'beverages', name: 'Beverages', icon: 'coffee' },
      { id: 'snacks', name: 'Snacks', icon: 'cookie' },
    ];
  }

  // Meal logging
  async logMeal(userId, { date, mealType, items, notes }) {
    const mealDate = date || getDateString();
    const meal = new MealLog({
      user: userId,
      date: mealDate,
      mealType,
      items,
      notes,
    });
    await meal.save();

    // Update daily log
    await this.updateDailyCalories(userId, mealDate);

    return meal;
  }

  async getMealsByDate(userId, date) {
    const meals = await MealLog.find({ user: userId, date }).sort({ mealType: 1 });
    const totals = meals.reduce(
      (acc, meal) => ({
        calories: acc.calories + meal.totalCalories,
        protein: acc.protein + meal.totalProtein,
        carbs: acc.carbs + meal.totalCarbs,
        fat: acc.fat + meal.totalFat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );

    return { meals, totals, date };
  }

  async deleteMeal(userId, mealId) {
    const meal = await MealLog.findOneAndDelete({ _id: mealId, user: userId });
    if (!meal) {
      const error = new Error('Meal not found.');
      error.statusCode = 404;
      throw error;
    }
    await this.updateDailyCalories(userId, meal.date);
    return { message: 'Meal deleted.' };
  }

  async updateDailyCalories(userId, date) {
    const meals = await MealLog.find({ user: userId, date });
    const totalConsumed = meals.reduce((sum, m) => sum + m.totalCalories, 0);

    await DailyLog.findOneAndUpdate(
      { user: userId, date },
      { $set: { 'calories.consumed': totalConsumed } },
      { upsert: true, new: true }
    );
  }

  // AI suggestions
  async getMealSuggestions(userId, mealType) {
    const suggestions = {
      breakfast: [
        { name: 'Oatmeal with Berries', calories: 300, protein: 10, carbs: 50, fat: 8 },
        { name: 'Greek Yogurt Parfait', calories: 250, protein: 15, carbs: 35, fat: 6 },
        { name: 'Egg White Omelette', calories: 200, protein: 25, carbs: 5, fat: 8 },
        { name: 'Protein Smoothie', calories: 350, protein: 30, carbs: 40, fat: 10 },
      ],
      lunch: [
        { name: 'Grilled Chicken Salad', calories: 400, protein: 35, carbs: 20, fat: 15 },
        { name: 'Quinoa Buddha Bowl', calories: 450, protein: 18, carbs: 60, fat: 14 },
        { name: 'Turkey Wrap', calories: 380, protein: 28, carbs: 40, fat: 12 },
        { name: 'Tuna Poke Bowl', calories: 420, protein: 32, carbs: 45, fat: 10 },
      ],
      dinner: [
        { name: 'Salmon with Vegetables', calories: 500, protein: 40, carbs: 25, fat: 22 },
        { name: 'Lean Beef Stir Fry', calories: 480, protein: 35, carbs: 40, fat: 18 },
        { name: 'Chicken Breast with Rice', calories: 520, protein: 42, carbs: 55, fat: 12 },
        { name: 'Tofu Curry with Quinoa', calories: 440, protein: 22, carbs: 50, fat: 16 },
      ],
      snack: [
        { name: 'Protein Bar', calories: 200, protein: 20, carbs: 22, fat: 8 },
        { name: 'Mixed Nuts (30g)', calories: 180, protein: 6, carbs: 8, fat: 16 },
        { name: 'Apple with Peanut Butter', calories: 250, protein: 7, carbs: 30, fat: 14 },
        { name: 'Rice Cakes with Hummus', calories: 150, protein: 5, carbs: 25, fat: 4 },
      ],
    };

    return suggestions[mealType] || suggestions.snack;
  }
}

module.exports = new CalorieService();
