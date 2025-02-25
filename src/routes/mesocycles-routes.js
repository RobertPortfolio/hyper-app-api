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
router.delete('/:mesocycleId', deleteMesocycle);
router.put('/', updateMesocycle);
router.patch('/change-current-meso/', changeCurrentMesocycle);
router.patch('/change-current-day/', changeCurrentDay);
router.patch('/delete-exercise/', deleteExercise);
router.patch('/add-exercise/', addExercise);
router.patch('/replace-exercise/', replaceExercise);
router.patch('/move-exercise/', moveExercise);
router.patch('/delete-set/', deleteSet);
router.patch('/add-set/', addSet);
router.patch('/update-set/', updateSet);
router.patch('/apply-notes/', applyNotesToExercisesInMesocycle);
router.patch('/update-status/', updateStatus);

module.exports = router;