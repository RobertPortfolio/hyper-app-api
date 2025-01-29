const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Используйте переменную окружения

exports.authMiddleware = (req, res, next) => {
    // Получение токена из cookies или заголовка Authorization
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    try {
        // Проверка и расшифровка токена
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Сохраняем данные пользователя в запросе
        next();
    } catch (error) {
        // Проверяем тип ошибки JWT
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Unauthorized: Token expired' });
        }
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};