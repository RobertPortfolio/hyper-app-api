const Mesocycle = require('../models/mesocycle-model');

exports.getUserMesocycles = async (req, res) => {
    const { userId } = req.params;
    
    try {
        const mesocycles = await Mesocycle.find({
            $or: [
                { authorId: userId }
            ]
        });
        res.status(200).json(mesocycles);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching mesocycles', error: err });
    }
};

// Создание нового шаблона
exports.createMesocycle = async (req, res) => {
    const mesocycleData = req.body;

    try {
        // Обновляем все существующие мезоциклы, устанавливая isCurrent в false
        await Mesocycle.updateMany(
            { authorId: mesocycleData.authorId },
            { $set: { isCurrent: false } }
        );

        // Создаем новый мезоцикл
        const newMesocycle = new Mesocycle(mesocycleData);
        await newMesocycle.save();

        // Отправляем новый мезоцикл в ответе
        res.status(201).json(newMesocycle);
    } catch (err) {
        res.status(500).json({ message: 'Error creating mesocycle', error: err });
    }
};

// Удаление шаблона
exports.deleteMesocycle = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMesocycle = await Mesocycle.findByIdAndDelete(id);
        if (!deletedMesocycle) {
            return res.status(404).json({ message: 'Mesocycle not found' });
        }
        res.status(200).json({ 
            message: 'Mesocycle deleted successfully',
            deletedMesocycle: deletedMesocycle,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting mesocycle', error: err });
    }
};

exports.updateMesocycle = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Например, весь объект мезоцикла
        const updatedMesocycle = await Mesocycle.findByIdAndUpdate(
            id,
            updatedData, // Данные для обновления
            { new: true, runValidators: true } // Опции: возвращать обновлённый документ и запускать валидацию
        );

        if (!updatedMesocycle) {
            return res.status(404).json({ message: 'Mesocycle not found' });
        }

        res.json(updatedMesocycle);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.changeCurrentMesocycle = async (req, res) => {
    try {
        const { id, userId } = req.params;

        // Проверка входных данных
        if (!id || !userId) {
            return res.status(400).json({ message: 'Invalid parameters' });
        }

        // Сбрасываем статус текущего для всех мезоциклов пользователя
        await Mesocycle.updateMany(
            { authorId: userId },
            { $set: { isCurrent: false } }
        );

        // Устанавливаем текущий статус для указанного мезоцикла
        const updatedMesocycle = await Mesocycle.findByIdAndUpdate(
            id,
            { $set: { isCurrent: true } },
            { new: true } // Возвращает обновлённый документ
        );

        // Если мезоцикл не найден
        if (!updatedMesocycle) {
            return res.status(404).json({ message: 'Mesocycle not found' });
        }

        // Возвращаем обновлённый мезоцикл
        res.json(updatedMesocycle);
    } catch (error) {
        console.error('Error updating current mesocycle:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};