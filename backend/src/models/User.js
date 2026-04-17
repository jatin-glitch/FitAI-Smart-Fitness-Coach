const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    profile: {
      height: { type: Number, default: null }, // cm
      weight: { type: Number, default: null }, // kg
      age: { type: Number, default: null },
      gender: { type: String, enum: ['male', 'female', 'other'], default: null },
      activityLevel: {
        type: String,
        enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
        default: 'moderate',
      },
      fitnessGoal: {
        type: String,
        enum: ['lose_weight', 'build_muscle', 'stay_fit', 'gain_weight', 'improve_flexibility'],
        default: 'stay_fit',
      },
      targetWeight: { type: Number, default: null },
      dailyCalorieGoal: { type: Number, default: 2000 },
      dailyStepGoal: { type: Number, default: 10000 },
      weeklyWorkoutGoal: { type: Number, default: 4 },
    },
    preferences: {
      theme: { type: String, enum: ['dark', 'light', 'system'], default: 'system' },
      voiceCoachEnabled: { type: Boolean, default: true },
      notificationsEnabled: { type: Boolean, default: true },
      hapticFeedback: { type: Boolean, default: true },
    },
    streak: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActiveDate: { type: Date, default: null },
    },
    onboardingCompleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
