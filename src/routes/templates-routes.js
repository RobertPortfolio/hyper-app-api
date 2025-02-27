const express = require('express');
const { getTemplates,
		getUserTemplates,
		createTemplate,
		deleteTemplate } = require('../controllers/templates-controllers');
const { authMiddleware } = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/', authMiddleware, getTemplates);
router.get('/:userId', authMiddleware, getUserTemplates);
router.post('/', authMiddleware, createTemplate);
router.delete('/:id', authMiddleware, deleteTemplate);

module.exports = router;