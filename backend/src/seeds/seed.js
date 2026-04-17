const mongoose = require('mongoose');
require('dotenv').config();
const Exercise = require('../models/Exercise');
const WorkoutPlan = require('../models/WorkoutPlan');
const FoodItem = require('../models/FoodItem');

const exercises = [
  { name: 'Push-ups', description: 'Classic bodyweight chest exercise', muscleGroup: 'chest', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 7, instructions: ['Start in plank position', 'Lower body until chest nearly touches floor', 'Push back up to starting position'], tips: ['Keep core tight', 'Elbows at 45 degrees'], targetMuscles: ['chest', 'triceps', 'shoulders'], isCompound: true },
  { name: 'Pull-ups', description: 'Upper body pulling exercise', muscleGroup: 'back', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 8, instructions: ['Hang from bar with overhand grip', 'Pull yourself up until chin is over bar', 'Lower slowly'], tips: ['Full range of motion', 'Avoid swinging'], targetMuscles: ['back', 'biceps', 'forearms'], isCompound: true },
  { name: 'Squats', description: 'Fundamental lower body exercise', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 8, instructions: ['Stand with feet shoulder-width apart', 'Lower hips back and down', 'Return to standing'], tips: ['Keep chest up', 'Knees track over toes'], targetMuscles: ['quadriceps', 'glutes', 'hamstrings'], isCompound: true },
  { name: 'Deadlift', description: 'Full body compound lift', muscleGroup: 'back', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 9, instructions: ['Stand with feet hip-width', 'Hinge at hips, grip bar', 'Stand up driving through heels'], tips: ['Keep back neutral', 'Bar close to body'], targetMuscles: ['back', 'glutes', 'hamstrings'], isCompound: true },
  { name: 'Bench Press', description: 'Primary chest pressing movement', muscleGroup: 'chest', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: ['Lie on bench, grip bar wider than shoulders', 'Lower to chest', 'Press up to lockout'], tips: ['Retract shoulder blades', 'Feet flat on floor'], targetMuscles: ['chest', 'triceps', 'shoulders'], isCompound: true },
  { name: 'Overhead Press', description: 'Shoulder pressing movement', muscleGroup: 'shoulders', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 6, instructions: ['Stand with bar at shoulders', 'Press overhead to lockout', 'Lower with control'], tips: ['Brace core', 'Full lockout'], targetMuscles: ['shoulders', 'triceps'], isCompound: true },
  { name: 'Bicep Curls', description: 'Isolation arm exercise', muscleGroup: 'arms', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 4, instructions: ['Hold dumbbells at sides', 'Curl up squeezing biceps', 'Lower slowly'], tips: ['No swinging', 'Control the negative'], targetMuscles: ['biceps'], isCompound: false },
  { name: 'Plank', description: 'Core stability exercise', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 5, instructions: ['Forearms on ground, body straight', 'Hold position', 'Breathe steadily'], tips: ['Dont let hips sag', 'Squeeze glutes'], targetMuscles: ['core', 'shoulders'], isCompound: false },
  { name: 'Lunges', description: 'Unilateral leg exercise', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 7, instructions: ['Step forward into lunge', 'Lower back knee toward floor', 'Push back to start'], tips: ['Keep torso upright', '90-degree angles'], targetMuscles: ['quadriceps', 'glutes'], isCompound: true },
  { name: 'Burpees', description: 'Full body cardio exercise', muscleGroup: 'full_body', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 12, instructions: ['Squat down, hands on floor', 'Jump feet back to plank', 'Do a push-up, jump feet forward, jump up'], tips: ['Maintain pace', 'Land softly'], targetMuscles: ['full_body'], isCompound: true },
  { name: 'Mountain Climbers', description: 'Cardio and core exercise', muscleGroup: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 10, instructions: ['Start in plank', 'Drive knees to chest alternately', 'Keep hips level'], tips: ['Fast pace', 'Core engaged'], targetMuscles: ['core', 'shoulders', 'legs'], isCompound: true },
  { name: 'Dumbbell Rows', description: 'Back pulling exercise', muscleGroup: 'back', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 6, instructions: ['Hinge forward holding dumbbell', 'Pull to hip', 'Lower with control'], tips: ['Squeeze shoulder blade', 'Neutral spine'], targetMuscles: ['back', 'biceps'], isCompound: true },
  { name: 'Tricep Dips', description: 'Tricep isolation exercise', muscleGroup: 'arms', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 6, instructions: ['Hands on bench behind you', 'Lower body by bending elbows', 'Push back up'], tips: ['Elbows close to body', 'Full range of motion'], targetMuscles: ['triceps', 'chest'], isCompound: false },
  { name: 'Jumping Jacks', description: 'Cardio warm-up exercise', muscleGroup: 'cardio', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 8, instructions: ['Stand with feet together', 'Jump spreading legs and raising arms', 'Jump back to start'], tips: ['Light on feet', 'Consistent rhythm'], targetMuscles: ['full_body'], isCompound: true },
  { name: 'Russian Twists', description: 'Oblique and core exercise', muscleGroup: 'core', equipment: 'bodyweight', difficulty: 'beginner', caloriesPerMinute: 5, instructions: ['Sit with knees bent, lean back slightly', 'Rotate torso side to side', 'Touch hands to ground each side'], tips: ['Keep feet off ground for harder version', 'Control the rotation'], targetMuscles: ['obliques', 'core'], isCompound: false },
  { name: 'Leg Press', description: 'Machine lower body exercise', muscleGroup: 'legs', equipment: 'machine', difficulty: 'beginner', caloriesPerMinute: 7, instructions: ['Sit in machine with feet on platform', 'Lower weight by bending knees', 'Press back to starting position'], tips: ['Dont lock knees', 'Full range of motion'], targetMuscles: ['quadriceps', 'glutes'], isCompound: true },
  { name: 'Lateral Raises', description: 'Shoulder isolation exercise', muscleGroup: 'shoulders', equipment: 'dumbbells', difficulty: 'beginner', caloriesPerMinute: 4, instructions: ['Hold dumbbells at sides', 'Raise arms out to sides to shoulder height', 'Lower slowly'], tips: ['Slight bend in elbows', 'Control the movement'], targetMuscles: ['shoulders'], isCompound: false },
  { name: 'Hip Thrusts', description: 'Glute focused exercise', muscleGroup: 'legs', equipment: 'barbell', difficulty: 'intermediate', caloriesPerMinute: 7, instructions: ['Back against bench, barbell over hips', 'Drive hips up squeezing glutes', 'Lower with control'], tips: ['Chin tucked', 'Full hip extension'], targetMuscles: ['glutes', 'hamstrings'], isCompound: true },
  { name: 'Box Jumps', description: 'Explosive lower body exercise', muscleGroup: 'legs', equipment: 'bodyweight', difficulty: 'intermediate', caloriesPerMinute: 10, instructions: ['Stand in front of box', 'Jump onto box landing softly', 'Step back down'], tips: ['Land softly', 'Full hip extension on top'], targetMuscles: ['quadriceps', 'glutes', 'calves'], isCompound: true },
  { name: 'Kettlebell Swings', description: 'Full body power exercise', muscleGroup: 'full_body', equipment: 'kettlebell', difficulty: 'intermediate', caloriesPerMinute: 11, instructions: ['Hinge at hips holding kettlebell', 'Swing kettlebell forward using hip drive', 'Control the backswing'], tips: ['Power from hips', 'Arms are just hooks'], targetMuscles: ['glutes', 'hamstrings', 'core', 'shoulders'], isCompound: true },
];

const foods = [
  { name: 'Chicken Breast', category: 'protein', calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Brown Rice', category: 'grains', calories: 216, protein: 5, carbs: 45, fat: 1.8, fiber: 3.5, servingSize: 100, servingUnit: 'g' },
  { name: 'Broccoli', category: 'vegetables', calories: 55, protein: 3.7, carbs: 11, fat: 0.6, fiber: 5.1, servingSize: 100, servingUnit: 'g' },
  { name: 'Salmon', category: 'protein', calories: 208, protein: 20, carbs: 0, fat: 13, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Sweet Potato', category: 'vegetables', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, fiber: 3, servingSize: 100, servingUnit: 'g' },
  { name: 'Egg', category: 'protein', calories: 155, protein: 13, carbs: 1.1, fat: 11, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Greek Yogurt', category: 'dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Banana', category: 'fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, fiber: 2.6, servingSize: 100, servingUnit: 'g' },
  { name: 'Oatmeal', category: 'grains', calories: 389, protein: 17, carbs: 66, fat: 7, fiber: 11, servingSize: 100, servingUnit: 'g' },
  { name: 'Almonds', category: 'nuts_seeds', calories: 579, protein: 21, carbs: 22, fat: 50, fiber: 12, servingSize: 100, servingUnit: 'g' },
  { name: 'Apple', category: 'fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, fiber: 2.4, servingSize: 100, servingUnit: 'g' },
  { name: 'Avocado', category: 'fruits', calories: 160, protein: 2, carbs: 9, fat: 15, fiber: 7, servingSize: 100, servingUnit: 'g' },
  { name: 'Quinoa', category: 'grains', calories: 120, protein: 4.4, carbs: 21, fat: 1.9, fiber: 2.8, servingSize: 100, servingUnit: 'g' },
  { name: 'Tuna', category: 'protein', calories: 132, protein: 28, carbs: 0, fat: 1.3, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Spinach', category: 'vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, fiber: 2.2, servingSize: 100, servingUnit: 'g' },
  { name: 'Whole Wheat Bread', category: 'grains', calories: 247, protein: 13, carbs: 41, fat: 3.4, fiber: 7, servingSize: 100, servingUnit: 'g' },
  { name: 'Cottage Cheese', category: 'dairy', calories: 98, protein: 11, carbs: 3.4, fat: 4.3, fiber: 0, servingSize: 100, servingUnit: 'g' },
  { name: 'Peanut Butter', category: 'nuts_seeds', calories: 588, protein: 25, carbs: 20, fat: 50, fiber: 6, servingSize: 100, servingUnit: 'g' },
  { name: 'Tofu', category: 'protein', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, fiber: 0.3, servingSize: 100, servingUnit: 'g' },
  { name: 'Blueberries', category: 'fruits', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, fiber: 2.4, servingSize: 100, servingUnit: 'g' },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitai');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Exercise.deleteMany({});
    await WorkoutPlan.deleteMany({ isSystem: true });
    await FoodItem.deleteMany({});

    // Seed exercises
    const savedExercises = await Exercise.insertMany(exercises);
    console.log(`Seeded ${savedExercises.length} exercises`);

    // Seed food items
    const savedFoods = await FoodItem.insertMany(foods);
    console.log(`Seeded ${savedFoods.length} food items`);

    // Create workout plans using saved exercise IDs
    const findExercise = (name) => savedExercises.find((e) => e.name === name)?._id;

    const workoutPlans = [
      {
        name: 'Full Body Blast', description: 'Complete full body workout for all fitness levels', category: 'full_body', difficulty: 'intermediate', duration: 45, caloriesBurn: 350, isSystem: true,
        targetMuscles: ['chest', 'back', 'legs', 'core'],
        exercises: [
          { exercise: findExercise('Jumping Jacks'), sets: 3, reps: 20, restTime: 30, order: 1 },
          { exercise: findExercise('Squats'), sets: 4, reps: 15, restTime: 60, order: 2 },
          { exercise: findExercise('Push-ups'), sets: 3, reps: 12, restTime: 60, order: 3 },
          { exercise: findExercise('Dumbbell Rows'), sets: 3, reps: 12, restTime: 60, order: 4 },
          { exercise: findExercise('Lunges'), sets: 3, reps: 12, restTime: 60, order: 5 },
          { exercise: findExercise('Plank'), sets: 3, duration: 45, restTime: 30, order: 6 },
        ].filter((e) => e.exercise),
      },
      {
        name: 'Upper Body Power', description: 'Build strength in chest, back, shoulders, and arms', category: 'strength', difficulty: 'intermediate', duration: 40, caloriesBurn: 300, isSystem: true,
        targetMuscles: ['chest', 'back', 'shoulders', 'arms'],
        exercises: [
          { exercise: findExercise('Bench Press'), sets: 4, reps: 10, restTime: 90, order: 1 },
          { exercise: findExercise('Pull-ups'), sets: 4, reps: 8, restTime: 90, order: 2 },
          { exercise: findExercise('Overhead Press'), sets: 3, reps: 10, restTime: 60, order: 3 },
          { exercise: findExercise('Dumbbell Rows'), sets: 3, reps: 12, restTime: 60, order: 4 },
          { exercise: findExercise('Bicep Curls'), sets: 3, reps: 12, restTime: 45, order: 5 },
          { exercise: findExercise('Tricep Dips'), sets: 3, reps: 12, restTime: 45, order: 6 },
        ].filter((e) => e.exercise),
      },
      {
        name: 'Leg Day', description: 'Intense lower body workout', category: 'strength', difficulty: 'intermediate', duration: 50, caloriesBurn: 400, isSystem: true,
        targetMuscles: ['legs', 'glutes'],
        exercises: [
          { exercise: findExercise('Squats'), sets: 4, reps: 12, restTime: 90, order: 1 },
          { exercise: findExercise('Lunges'), sets: 3, reps: 12, restTime: 60, order: 2 },
          { exercise: findExercise('Hip Thrusts'), sets: 4, reps: 12, restTime: 60, order: 3 },
          { exercise: findExercise('Leg Press'), sets: 3, reps: 15, restTime: 60, order: 4 },
          { exercise: findExercise('Box Jumps'), sets: 3, reps: 10, restTime: 60, order: 5 },
        ].filter((e) => e.exercise),
      },
      {
        name: 'HIIT Cardio Burn', description: 'High intensity interval training for maximum calorie burn', category: 'hiit', difficulty: 'advanced', duration: 30, caloriesBurn: 450, isSystem: true,
        targetMuscles: ['full_body'],
        exercises: [
          { exercise: findExercise('Burpees'), sets: 4, reps: 15, restTime: 30, order: 1 },
          { exercise: findExercise('Mountain Climbers'), sets: 4, duration: 45, restTime: 15, order: 2 },
          { exercise: findExercise('Jumping Jacks'), sets: 3, reps: 30, restTime: 15, order: 3 },
          { exercise: findExercise('Kettlebell Swings'), sets: 4, reps: 20, restTime: 30, order: 4 },
          { exercise: findExercise('Box Jumps'), sets: 3, reps: 12, restTime: 30, order: 5 },
        ].filter((e) => e.exercise),
      },
      {
        name: 'Core Crusher', description: 'Focused core and ab workout', category: 'strength', difficulty: 'beginner', duration: 25, caloriesBurn: 200, isSystem: true,
        targetMuscles: ['core', 'obliques'],
        exercises: [
          { exercise: findExercise('Plank'), sets: 3, duration: 60, restTime: 30, order: 1 },
          { exercise: findExercise('Russian Twists'), sets: 3, reps: 20, restTime: 30, order: 2 },
          { exercise: findExercise('Mountain Climbers'), sets: 3, duration: 30, restTime: 30, order: 3 },
        ].filter((e) => e.exercise),
      },
      {
        name: 'Beginner Starter', description: 'Perfect for those just starting their fitness journey', category: 'full_body', difficulty: 'beginner', duration: 30, caloriesBurn: 200, isSystem: true,
        targetMuscles: ['chest', 'legs', 'core'],
        exercises: [
          { exercise: findExercise('Jumping Jacks'), sets: 2, reps: 15, restTime: 30, order: 1 },
          { exercise: findExercise('Squats'), sets: 3, reps: 10, restTime: 60, order: 2 },
          { exercise: findExercise('Push-ups'), sets: 2, reps: 8, restTime: 60, order: 3 },
          { exercise: findExercise('Plank'), sets: 2, duration: 30, restTime: 30, order: 4 },
          { exercise: findExercise('Lunges'), sets: 2, reps: 10, restTime: 60, order: 5 },
        ].filter((e) => e.exercise),
      },
    ];

    const savedPlans = await WorkoutPlan.insertMany(workoutPlans);
    console.log(`Seeded ${savedPlans.length} workout plans`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();
