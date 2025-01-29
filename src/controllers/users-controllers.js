const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user-model');
const { generateToken } = require('../utils/token-utils');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Используйте переменные окружения для безопасности

// Регистрация
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    try {
        // Проверка, существует ли пользователь
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Пользователь уже существует' });
        }

        // Создание нового пользователя
        const newUser = await User.create({ username, email, password });

        // Генерация JWT
        const token = generateToken(newUser);

        // Установка токена в cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Возвращаем пользователя и токен
        res.status(201).json({
            message: 'Пользователь успешно зарегистрирован',
            user: { _id: newUser._id, username: newUser.username, email: newUser.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Логин
exports.loginUser = async (req, res) => {
    const { emailOrUsername, password } = req.body;

    if (!emailOrUsername || !password) {
        return res.status(400).json({ error: 'Не все поля заполнены' });
    }

    try {
        const user = await User.findOne({
            $or: [{ email: emailOrUsername }, { username: emailOrUsername }]
        }).exec();
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Неправильные данные' });
        }

        // Создание JWT
        const token = generateToken(user);
        // Установка токена в cookie
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({ 
            message: 'Вход успешен', 
            user: { _id: user._id, username: user.username, email: user.email },
            token,
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};

// Выход
exports.logoutUser = (req, res) => {
    res.clearCookie('token').json({ message: 'Logout successful' });
};

//Проверка пользователя
exports.getCurrentUser = async (req, res) => {
    try {
        // Данные пользователя берутся из `req.user`, добавленного мидлваром проверки токена
        const user = await User.findById(req.user.id).select('-password'); // Исключаем пароль
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};