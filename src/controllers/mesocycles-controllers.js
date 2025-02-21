const Mesocycle = require('../models/mesocycle-model');
const mongoose = require("mongoose");

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

// Функция для поиска текущего мезоцикла
const findCurrentMesocycle = (mesocycles) => {
  return mesocycles.find(meso => meso.isCurrent) || null;
};

// Функция для получения текущего дня в текущем мезоцикле (через weeks)
const getCurrentDay = (mesocycle) => {
  if (!mesocycle) return null;
  const days = mesocycle.weeks.reduce((acc, week) => acc.concat(week.days), []);
  return days.find(day => day.isCurrent) || null;
};

// Функция для поиска дня по ID в текущем мезоцикле (через weeks)
const getDayById = (mesocycle, dayId) => {
  if (!mesocycle) return null;
  const days = mesocycle.weeks.reduce((acc, week) => acc.concat(week.days), []);
  return days.find(day => day._id.toString() === dayId) || null;
};

// Создание пустого подхода
const getEmptySet = (weight = "", type = "straight") => ({
  _id: new mongoose.Types.ObjectId(),
  weight,
  reps: "",
  type,
  isDone: false,
});

// Создание пустого упражнения
const getEmptyExercise = (targetMuscleGroupId, exerciseId, notes = "") => ({
  _id: new mongoose.Types.ObjectId(),
  targetMuscleGroupId,
  exerciseId,
  sets: [getEmptySet(), getEmptySet()], // Два пустых подхода по умолчанию
  notes,
  pumpRate: "",
  sorenessRate: "",
  jointPainRate: "",
  workloadRate: "",
});


exports.changeCurrentDay = async (req, res) => {
  try {
    const { id } = req.params; // ID мезоцикла
    const { dayId } = req.body; // ID нового текущего дня

    // Получаем мезоцикл по id
    const mesocycle = await Mesocycle.findById(id);
    if (!mesocycle) {
      return res.status(404).json({ message: 'Мезоцикл не найден' });
    }

    // Используем вспомогательные функции для получения дней
    const prevDay = getCurrentDay(mesocycle);
    const newDay = getDayById(mesocycle, dayId);

    if (!newDay) {
      return res.status(404).json({ message: 'Новый день не найден в этом мезоцикле' });
    }

    // Если предыдущий текущий день отличается от нового, сбрасываем его флаг
    if (prevDay && prevDay._id.toString() !== dayId) {
      // Поскольку дни находятся внутри недель, используем конструкцию обновления с массивом вложенных документов.
      await Mesocycle.updateOne(
        { _id: id, "weeks.days._id": prevDay._id },
        { $set: { "weeks.$[week].days.$[day].isCurrent": false } },
        { arrayFilters: [{ "week.days": { $elemMatch: { _id: prevDay._id } } }, { "day._id": prevDay._id }] }
      );
    }

    // Устанавливаем новый текущий день
    await Mesocycle.updateOne(
      { _id: id, "weeks.days._id": dayId },
      { $set: { "weeks.$[week].days.$[day].isCurrent": true } },
      { arrayFilters: [{ "week.days": { $elemMatch: { _id: dayId } } }, { "day._id": dayId }] }
    );

    res.json({ message: 'Текущий день обновлён' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;       // ID мезоцикла
    const { exerciseId } = req.body;   // ID упражнения для удаления

    // Выполняем атомарное обновление: ищем мезоцикл, затем в каждом дне (внутри недель),
    // где isCurrent: true, удаляем упражнение с _id равным exerciseId.
    const result = await Mesocycle.updateOne(
      { _id: id, "weeks.days.isCurrent": true },
      { $pull: { "weeks.$[].days.$[day].exercises": { _id: exerciseId } } },
      { arrayFilters: [{ "day.isCurrent": true }] }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Упражнение не удалено или не найдено' });
    }

    res.json({ message: 'Упражнение удалено' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.addExercise = async (req, res) => {
  try {
    const { id } = req.params; // ID мезоцикла
    const { targetMuscleGroupId, exerciseId, notes } = req.body; // Данные упражнения

    // Генерируем новое упражнение
    const newExercise = getEmptyExercise(targetMuscleGroupId, exerciseId, notes);

    // Выполняем атомарное добавление в текущий день
    const result = await Mesocycle.updateOne(
      { _id: id, "weeks.days.isCurrent": true },
      { $push: { "weeks.$[].days.$[day].exercises": newExercise } },
      { arrayFilters: [{ "day.isCurrent": true }] }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Текущий день не найден или упражнение не добавлено" });
    }

    res.json({ message: "Упражнение добавлено", exercise: newExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера" });
  }
};

exports.replaceExercise = async (req, res) => {
  try {
    const { id } = req.params; // ID мезоцикла
    const { exerciseId, targetMuscleGroupId, newExerciseId, notes } = req.body; // Параметры замены

    // Создаем новое упражнение с новым _id
    const newExercise = getEmptyExercise(targetMuscleGroupId, newExerciseId, notes);

    // MongoDB операция: заменяем упражнение по индексу
    const result = await Mesocycle.updateOne(
      { _id: id, "weeks.days.isCurrent": true, "weeks.days.exercises._id": exerciseId },
      { $set: { "weeks.$[].days.$[day].exercises.$[exercise]": newExercise } },
      {
        arrayFilters: [
          { "day.isCurrent": true },
          { "exercise._id": exerciseId }
        ]
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Упражнение не найдено или не заменено" });
    }

    res.json({ message: "Упражнение заменено", exercise: newExercise });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ошибка сервера", error: error.message });
  }
};

exports.moveExercise = async (req, res) => {
    try {
        const { id } = req.params; // ID мезоцикла
        const { exerciseId, direction } = req.body;

        // Находим мезоцикл и текущий день
        const mesocycle = await Mesocycle.findOne(
            { _id: id, "weeks.days.isCurrent": true },
            { "weeks.days.$": 1 }
        );

        if (!mesocycle) {
            return res.status(404).json({ message: "Мезоцикл или текущий день не найден" });
        }

        const day = mesocycle.weeks.flatMap(week => week.days).find(day => day.isCurrent);
        if (!day) {
            return res.status(404).json({ message: "Текущий день не найден" });
        }

        // Находим индекс упражнения
        const index = day.exercises.findIndex(ex => ex._id.toString() === exerciseId);
        if (index === -1) {
            return res.status(404).json({ message: "Упражнение не найдено" });
        }

        // Вычисляем новый индекс в зависимости от направления
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= day.exercises.length) {
            return res.status(400).json({ message: "Нельзя переместить дальше" });
        }

        // Упражнение, которое нужно переместить
        const exerciseToMove = day.exercises[index];

        // Операция для обмена местами элементов массива
        const result = await Mesocycle.updateOne(
            { _id: id, "weeks.days.isCurrent": true },
            {
                $set: {
                    // Сначала ставим на место нового индекса одно упражнение
                    [`weeks.$[].days.$[day].exercises.${newIndex}`]: exerciseToMove,
                    // Потом ставим на место старого индекса второе упражнение
                    [`weeks.$[].days.$[day].exercises.${index}`]: day.exercises[newIndex]
                }
            },
            { arrayFilters: [{ "day.isCurrent": true }] }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Ошибка обновления" });
        }

        res.json({ message: "Упражнение перемещено" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ошибка сервера" });
    }
};