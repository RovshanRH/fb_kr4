const { Pool } = require('pg');
const express = require('express');
const app = express();

const { Sequelize, DataTypes, cast } = require('sequelize');
import { Attribute, PrimaryKey, AutoIncrement } from '@sequelize/core/decorators-legacy';


const sequelize = new Sequelize('mydatabase', 'postgres', 'password', {
    host: 'localhost',
    dialect: 'postgres',
});

// Проверка подключения
sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error:', err));

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'fb_kr4',
    password: '1',
    port: 5432,
});

app.use(express.json());

// sequilize
class User extends Model {
    @Attribute(DataTypes.INTEGER)
    @PrimaryKey
    @AutoIncrement
    ID;
}
const User = sequelize('user', {
    ID,
    first_name: {type: DataTypes.TEXT, allowNull: false},
    last_name: {type: DataTypes.TEXT, allowNull: false},
    age: {type: DataTypes.INTEGER, allowNull: false},
    created_at: {type: DataTypes.timestamp, allowNull: false},
    updated_at: {type: DataTypes.timestamp, allowNull: false}
}); 

sequelize.sync({force: true});

//crud
// Создание нового пользователя
app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).send(user);
    } catch (err) {
        res.status(400).send(err.message);
    }
})

// Получение списка пользователей
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll()
        res.send(users)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// Получение пользователя по id
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findAll({ID: req.params.id})
        res.send(user)
    } catch (err) {
        res.status(500).send(err.message);
    }
})

// Обновление информации пользователя
app.patch('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findAll({ID: req.params.id})
        user = await User.update(req.body, {
            returning: true
        });
        res.send(user);
    } catch (err) {
        res.status(400).send(err.message)
    }
})

// Удаление пользователя
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findAll({ID: req.params.id})
        user = await User.destroy()
        res.send({message: 'User deleted'})
    } catch (err) {
        res.status(500).send(err.message);
    }
})

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});