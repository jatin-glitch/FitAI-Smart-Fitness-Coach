const DailyLog = require('../models/DailyLog');
const WorkoutLog = require('../models/WorkoutLog');
const User = require('../models/User');
const { getDateString } = require('../utils/helpers');

class ProgressService {
  async getDailyLog(userId, date) {
    const logDate = date || getDateString();
    let log = await DailyLog.findOne({ user: userId, date: logDate });
    if (!log) {
      const user = await User.findById(userId);
      log = await DailyLog.create({
        user: userId,
        date: logDate,
        calories: { goal: user.profile.dailyCalorieGoal },
        steps: { goal: user.profile.dailyStepGoal },
      });
    }
    return log;
  }

  async updateDailyLog(userId, date, updates) {
    const logDate = date || getDateString();
    const log = await DailyLog.findOneAndUpdate(
      { user: userId, date: logDate },
      { $set: updates },
      { new: true, upsert: true }
    );
    return log;
  }

  async getWeeklyStats(userId) {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push(getDateString(d));
    }

    const logs = await DailyLog.find({ user: userId, date: { $in: dates } }).sort({ date: 1 });
    const workoutLogs = await WorkoutLog.find({
      user: userId,
      completed: true,
      startTime: { $gte: new Date(dates[0]) },
    });

    const logsMap = {};
    logs.forEach((l) => { logsMap[l.date] = l; });

    const weekData = dates.map((date) => {
      const log = logsMap[date];
      return {
        date,
        calories: { consumed: log?.calories?.consumed || 0, burned: log?.calories?.burned || 0, goal: log?.calories?.goal || 2000 },
        steps: { count: log?.steps?.count || 0, goal: log?.steps?.goal || 10000 },
        workoutsCompleted: log?.workoutsCompleted || 0,
        activeMinutes: log?.activeMinutes || 0,
      };
    });

    const totalCalories = weekData.reduce((s, d) => s + d.calories.consumed, 0);
    const totalSteps = weekData.reduce((s, d) => s + d.steps.count, 0);
    const totalWorkouts = workoutLogs.length;
    const totalActiveMinutes = weekData.reduce((s, d) => s + d.activeMinutes, 0);

    return {
      days: weekData,
      summary: {
        avgCalories: Math.round(totalCalories / 7),
        totalSteps,
        totalWorkouts,
        totalActiveMinutes,
        avgActiveMinutes: Math.round(totalActiveMinutes / 7),
      },
    };
  }

  async getMonthlyStats(userId, month, year) {
    const now = new Date();
    const m = month || now.getMonth() + 1;
    const y = year || now.getFullYear();
    const startDate = `${y}-${String(m).padStart(2, '0')}-01`;
    const endDate = `${y}-${String(m).padStart(2, '0')}-31`;

    const logs = await DailyLog.find({
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: 1 });

    const workoutLogs = await WorkoutLog.find({
      user: userId,
      completed: true,
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate + 'T23:59:59') },
    });

    return {
      days: logs,
      summary: {
        totalWorkouts: workoutLogs.length,
        totalCaloriesBurned: workoutLogs.reduce((s, l) => s + l.caloriesBurned, 0),
        avgCalories: logs.length > 0 ? Math.round(logs.reduce((s, l) => s + (l.calories?.consumed || 0), 0) / logs.length) : 0,
        activeDays: logs.filter((l) => l.workoutsCompleted > 0).length,
      },
    };
  }

  async getStreak(userId) {
    const user = await User.findById(userId);
    return {
      current: user.streak.current,
      longest: user.streak.longest,
      lastActiveDate: user.streak.lastActiveDate,
    };
  }

  async updateStreak(userId) {
    const user = await User.findById(userId);
    const today = getDateString();
    const yesterday = getDateString(new Date(Date.now() - 86400000));

    // Normalize lastActiveDate to string (it's stored as Date in MongoDB)
    const lastActive = user.streak.lastActiveDate
      ? getDateString(new Date(user.streak.lastActiveDate))
      : null;

    if (lastActive === today) return user.streak;

    if (lastActive === yesterday) {
      user.streak.current += 1;
    } else {
      user.streak.current = 1;
    }

    user.streak.lastActiveDate = new Date(today);
    if (user.streak.current > user.streak.longest) {
      user.streak.longest = user.streak.current;
    }

    await user.save();
    return user.streak;
  }

  // AI Insights
  async getAIInsights(userId) {
    const insights = [];
    const weeklyStats = await this.getWeeklyStats(userId);
    const streak = await this.getStreak(userId);

    // Workout consistency
    if (weeklyStats.summary.totalWorkouts === 0) {
      insights.push({
        type: 'warning',
        title: 'Time to Move!',
        message: "You haven't completed any workouts this week. Even a short session can make a difference!",
        icon: 'alert-circle',
      });
    } else if (weeklyStats.summary.totalWorkouts >= 4) {
      insights.push({
        type: 'success',
        title: 'Great Consistency!',
        message: `You've completed ${weeklyStats.summary.totalWorkouts} workouts this week. Keep up the amazing work!`,
        icon: 'trophy',
      });
    }

    // Streak
    if (streak.current >= 7) {
      insights.push({
        type: 'achievement',
        title: 'Week Warrior!',
        message: `${streak.current}-day streak! You're building incredible habits.`,
        icon: 'flame',
      });
    } else if (streak.current >= 3) {
      insights.push({
        type: 'encouragement',
        title: 'Building Momentum',
        message: `${streak.current}-day streak! Just ${7 - streak.current} more days for a full week.`,
        icon: 'trending-up',
      });
    }

    // Calorie tracking
    const daysOverGoal = weeklyStats.days.filter(
      (d) => d.calories.consumed > d.calories.goal * 1.1
    ).length;
    if (daysOverGoal >= 3) {
      insights.push({
        type: 'info',
        title: 'Calorie Check',
        message: `You've exceeded your calorie goal ${daysOverGoal} days this week. Consider adjusting your meals.`,
        icon: 'info',
      });
    }

    // Step count
    const avgSteps = weeklyStats.summary.totalSteps / 7;
    if (avgSteps < 5000) {
      insights.push({
        type: 'suggestion',
        title: 'Move More',
        message: 'Your average daily steps are below 5,000. Try taking short walks throughout the day.',
        icon: 'walk',
      });
    }

    return insights;
  }
}

module.exports = new ProgressService();
