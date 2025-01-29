const express = require('express');
const { getTemplates,
		getUserTemplates,
		createTemplate,
		deleteTemplate } = require('../controllers/templates-controllers');

const router = express.Router();

router.get('/', getTemplates);
router.get('/:userId', getUserTemplates);
router.post('/', createTemplate);
router.delete('/:id', deleteTemplate);

module.exports = router;