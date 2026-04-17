const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  searchFoods, getFoodCategories, logMeal, getMealsByDate, deleteMeal, getMealSuggestions,
} = require('../controllers/calorieController');

router.get('/foods', auth, searchFoods);
router.get('/foods/categories', auth, getFoodCategories);
router.post('/meals', auth, logMeal);
router.get('/meals/:date', auth, getMealsByDate);
router.delete('/meals/:id', auth, deleteMeal);
router.get('/suggestions/:mealType', auth, getMealSuggestions);

module.exports = router;
