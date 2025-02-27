const Exercise = require('../models/exercise-model');

// Получение всех упражнений
exports.getExercises = async (req, res) => {
    try {
        const exercises = await Exercise.find({ isCustom: false });
        res.status(200).json(exercises);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching exercises', error: err });
    }
};

exports.getUserExercises = async (req, res) => {
    const { userId } = req.params;

    try {
        const exercises = await Exercise.find({
            $or: [
                { isCustom: false },
                { authorId: userId }
            ]
        });
        res.status(200).json(exercises);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching exercises', error: err });
    }
};

// Создание нового упражнения
exports.createExercise = async (req, res) => {
    const exerciseData = req.body;

    try {
        const newExercise = new Exercise(exerciseData);
        await newExercise.save();
        res.status(201).json(newExercise);
    } catch (err) {
        res.status(500).json({ message: 'Error creating exercise', error: err });
    }
};

// Удаление упражнения
exports.deleteExercise = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedExercise = await Exercise.findByIdAndDelete(id);
        if (!deletedExercise) {
            return res.status(404).json({ message: 'Exercise not found' });
        }
        res.status(200).json({ message: 'Exercise deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting exercise', error: err });
    }
};