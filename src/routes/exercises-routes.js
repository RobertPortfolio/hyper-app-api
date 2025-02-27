const express = require('express');
const { getExercises,
		getUserExercises,
		createExercise,
		deleteExercise } = require('../controllers/exercises-controllers');
const { authMiddleware } = require('../middleware/auth-middleware');
const router = express.Router();

router.get('/', authMiddleware, getExercises);
router.get('/:userId', authMiddleware, getUserExercises);
router.post('/', authMiddleware, createExercise);
router.delete('/:id', authMiddleware, deleteExercise);

module.exports = router;