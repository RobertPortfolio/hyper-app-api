const mongoose = require('mongoose');

const setSchema = new mongoose.Schema({
    weight: String,
    reps: String,
    type: String,
    isDone: Boolean,
});

const exerciseSchema = new mongoose.Schema({
    targetMuscleGroupId: String,
    exerciseId: String,
    sets: [setSchema],
    notes: String,
    pumpRate: String,
    sorenessRate: String,
    jointPainRate: String,
    workloadRate: String,
});

const daySchema = new mongoose.Schema({
    dayId: String,
    dayName: String,
    isCurrent: Boolean,
    isDone: Boolean,
    exercises: [exerciseSchema],
});

const weekSchema = new mongoose.Schema({
    number: Number,
    rir: String,
    days: [daySchema],
});

const mesocycleSchema = new mongoose.Schema({
    name: String,
    duration: String,
    isCurrent: Boolean,
    isDone: Boolean,
    startDate: String,
    endDate: String,
    authorId: mongoose.Schema.Types.ObjectId,
    weeks: [weekSchema],
});

module.exports = mongoose.model('Mesocycle', mesocycleSchema);