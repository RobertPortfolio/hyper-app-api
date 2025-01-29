const Template = require('../models/template-model');

// Получение всех шаблонов
exports.getTemplates = async (req, res) => {
    try {
        const templates = await Template.find();
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching templates', error: err });
    }
};

exports.getUserTemplates = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const templates = await Template.find({
            $or: [
                { isCustom: false },
                { authorId: userId }
            ]
        });
        res.status(200).json(templates);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching templates', error: err });
    }
};

// Создание нового шаблона
exports.createTemplate = async (req, res) => {
    const templateData = req.body;

    try {
        const newTemplate = new Template(templateData);
        await newTemplate.save();
        res.status(201).json(newTemplate);
    } catch (err) {
        res.status(500).json({ message: 'Error creating template', error: err });
    }
};

// Удаление шаблона
exports.deleteTemplate = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTemplate = await Template.findByIdAndDelete(id);
        if (!deletedTemplate) {
            return res.status(404).json({ message: 'Template not found' });
        }
        res.status(200).json(deletedTemplate);
    } catch (err) {
        res.status(500).json({ message: 'Error deleting template', error: err });
    }
};