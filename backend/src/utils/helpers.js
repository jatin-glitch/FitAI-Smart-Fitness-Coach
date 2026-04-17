const jwt = require('jsonwebtoken');
const config = require('../config');

const generateToken = (userId) => {
  return jwt.sign({ userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};

const getDateString = (date = new Date()) => {
  return date.toISOString().split('T')[0];
};

const calculateBMR = (weight, height, age, gender) => {
  if (gender === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
};

const calculateTDEE = (bmr, activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };
  return Math.round(bmr * (multipliers[activityLevel] || 1.55));
};

const calculateCalorieGoal = (tdee, goal) => {
  switch (goal) {
    case 'lose_weight':
      return Math.round(tdee - 500);
    case 'gain_weight':
    case 'build_muscle':
      return Math.round(tdee + 300);
    default:
      return tdee;
  }
};

module.exports = {
  generateToken,
  getDateString,
  calculateBMR,
  calculateTDEE,
  calculateCalorieGoal,
};
