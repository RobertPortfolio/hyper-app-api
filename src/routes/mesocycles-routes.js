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
		moveExercise,
		deleteSet,
		addSet,
		updateSet,
		applyNotesToExercisesInMesocycle,
		updateStatus, } = require('../controllers/mesocycles-controllers');

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
router.patch('/delete-set/:id', deleteSet);
router.patch('/add-set/:id', addSet);
router.patch('/update-set/:id', updateSet);
router.patch('/apply-notes/:id', applyNotesToExercisesInMesocycle);
router.patch('/update-status/:id', updateStatus);

module.exports = router;