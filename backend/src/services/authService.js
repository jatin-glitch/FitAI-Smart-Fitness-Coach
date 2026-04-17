const User = require('../models/User');
const { generateToken, calculateBMR, calculateTDEE, calculateCalorieGoal } = require('../utils/helpers');

class AuthService {
  async register({ email, password, name }) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('Email already registered.');
      error.statusCode = 409;
      throw error;
    }

    const user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user._id);
    return { user: user.toSafeObject(), token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = generateToken(user._id);
    return { user: user.toSafeObject(), token };
  }

  async updateProfile(userId, profileData) {
    const user = await User.findById(userId);
    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    Object.keys(profileData).forEach((key) => {
      if (profileData[key] !== undefined) {
        user.profile[key] = profileData[key];
      }
    });

    // Auto-calculate calorie goal if enough data
    const { weight, height, age, gender, activityLevel, fitnessGoal } = user.profile;
    if (weight && height && age && gender) {
      const bmr = calculateBMR(weight, height, age, gender);
      const tdee = calculateTDEE(bmr, activityLevel);
      user.profile.dailyCalorieGoal = calculateCalorieGoal(tdee, fitnessGoal);
    }

    await user.save();
    return user.toSafeObject();
  }

  async updatePreferences(userId, preferences) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { preferences } },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return user.toSafeObject();
  }

  async completeOnboarding(userId) {
    const user = await User.findByIdAndUpdate(
      userId,
      { onboardingCompleted: true },
      { new: true }
    ).select('-password');
    return user.toSafeObject();
  }
}

module.exports = new AuthService();
