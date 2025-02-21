const express = require('express');
const { getUserMesocycles,
		createMesocycle,
		deleteMesocycle,
		updateMesocycle,
		changeCurrentMesocycle,
		changeCurrentDay,
		deleteExercise,
		addExercise,
		replaceExercise,
		moveExercise, } = require('../controllers/mesocycles-controllers');

const router = express.Router();

router.get('/:userId', getUserMesocycles);
router.post('/', createMesocycle);
router.delete('/:id', deleteMesocycle);
router.put('/:id', updateMesocycle);
router.patch('/change-current-meso/:id/:userId', changeCurrentMesocycle);
router.patch('/change-current-day/:id', changeCurrentDay);
router.patch('/delete-exercise/:id', deleteExercise);
router.patch('/add-exercise/:id', addExercise);
router.patch('/replace-exercise/:id', replaceExercise);
router.patch('/move-exercise/:id', moveExercise);

module.exports = router;