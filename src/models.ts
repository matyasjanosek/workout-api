import mongoose from 'mongoose';

// user schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// workout schema
const workoutSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true }, // in minutes
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// exercise type like benchpress
const exerciseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

// exercise log - tracks weight and specific date
const exerciseLogSchema = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number, required: true }, // in kg
    reps: { type: Number, required: true },
    date: { type: Date, required: true }
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Workout = mongoose.model('Workout', workoutSchema);
export const Exercise = mongoose.model('Exercise', exerciseSchema);
export const ExerciseLog = mongoose.model('ExerciseLog', exerciseLogSchema);