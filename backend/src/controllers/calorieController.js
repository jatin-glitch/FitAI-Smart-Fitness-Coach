const calorieService = require('../services/calorieService');

const searchFoods = async (req, res, next) => {
  try {
    const result = await calorieService.searchFoods(req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getFoodCategories = async (req, res) => {
  const categories = await calorieService.getFoodCategories();
  res.json({ categories });
};

const logMeal = async (req, res, next) => {
  try {
    const meal = await calorieService.logMeal(req.userId, req.body);
    res.status(201).json({ meal });
  } catch (error) {
    next(error);
  }
};

const getMealsByDate = async (req, res, next) => {
  try {
    const result = await calorieService.getMealsByDate(req.userId, req.params.date);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const deleteMeal = async (req, res, next) => {
  try {
    const result = await calorieService.deleteMeal(req.userId, req.params.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getMealSuggestions = async (req, res, next) => {
  try {
    const suggestions = await calorieService.getMealSuggestions(req.userId, req.params.mealType);
    res.json({ suggestions });
  } catch (error) {
    next(error);
  }
};

module.exports = { searchFoods, getFoodCategories, logMeal, getMealsByDate, deleteMeal, getMealSuggestions };
