const express = require('express');
const { getUserMesocycles,
		createMesocycle,
		deleteMesocycle,
		updateMesocycle,
		changeCurrentMesocycle } = require('../controllers/mesocycles-controllers');

const router = express.Router();

router.get('/:userId', getUserMesocycles);
router.post('/', createMesocycle);
router.delete('/:id', deleteMesocycle);
router.put('/:id', updateMesocycle);
router.patch('/change-current-meso/:id/:userId', changeCurrentMesocycle);

module.exports = router;