const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
	name: String,
	emphasis: String,
	daysPerWeek: Number,
	isCustom: Boolean,
	authorId: String,	
	days: [
		{
			dayId: String,
			dayName: String,
			exercises: [
				{
					targetMuscleGroupId: String,
					exerciseId: String,
				}
			]
		}
	],
});

module.exports = mongoose.model('Template', templateSchema);