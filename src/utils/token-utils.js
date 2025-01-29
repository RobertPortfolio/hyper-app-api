const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, username: user.username, email: user.email }, 
        JWT_SECRET, 
        { expiresIn: '1h' }
    );
};

module.exports = {
    generateToken
}
