const express = require('express');
const { getExercises,
		getUserExercises,
		createExercise,
		deleteExercise } = require('../controllers/exercises-controllers');

const router = express.Router();

router.get('/', getExercises);
router.get('/:userId', getUserExercises);
router.post('/', createExercise);
router.delete('/:id', deleteExercise);

module.exports = router;