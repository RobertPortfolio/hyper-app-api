const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
	name: String,
	targetMuscleGroupId: String,
	equipmentId: String,
	notes: String,
	videoURL: String,
	isCustom: Boolean,
	authorId: String,
});

module.exports = mongoose.model('Exercise', exerciseSchema);