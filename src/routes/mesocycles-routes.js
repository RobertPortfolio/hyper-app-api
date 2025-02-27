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
const { authMiddleware } = require('../middleware/auth-middleware');
const router = express.Router();

router.get('/:userId', authMiddleware, getUserMesocycles);
router.post('/', authMiddleware, createMesocycle);
router.delete('/:mesocycleId', authMiddleware, deleteMesocycle);
router.put('/', authMiddleware, updateMesocycle);
router.patch('/change-current-meso/', authMiddleware, changeCurrentMesocycle);
router.patch('/change-current-day/', authMiddleware, changeCurrentDay);
router.patch('/delete-exercise/', authMiddleware, deleteExercise);
router.patch('/add-exercise/', authMiddleware, addExercise);
router.patch('/replace-exercise/', authMiddleware, replaceExercise);
router.patch('/move-exercise/', authMiddleware, moveExercise);
router.patch('/delete-set/', authMiddleware, deleteSet);
router.patch('/add-set/', authMiddleware, addSet);
router.patch('/update-set/', authMiddleware, updateSet);
router.patch('/apply-notes/', authMiddleware, applyNotesToExercisesInMesocycle);
router.patch('/update-status/', authMiddleware, updateStatus);

module.exports = router;