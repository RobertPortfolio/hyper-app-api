const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exercisesRoutes = require('./routes/exercises-routes');

const templatesRoutes = require('./routes/templates-routes');
const usersRoutes = require('./routes/users-routes');
const mesocyclesRoutes = require('./routes/mesocycles-routes');

const app = express();

app.use(cors({
    origin: [ 'http://localhost:3000' ], // Укажите ваш источник
    credentials: true, // Разрешить отправку куки
}));
app.use(bodyParser.json());

app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/users', usersRoutes);
app.use('/exercises', exercisesRoutes);
app.use('/templates', templatesRoutes);
app.use('/mesocycles', mesocyclesRoutes);

module.exports = app;




