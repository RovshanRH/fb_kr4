const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();

// Подключение к БД (исправлено имя БД)
const sequelize = new Sequelize('fb_kr4', 'postgres', '1', {
    host: 'localhost',
    dialect: 'postgres',
});

// Проверка подключения
sequelize.authenticate()
    .then(() => console.log('Connected to PostgreSQL'))
    .catch(err => console.error('Connection error:', err));

app.use(express.json());

// Определение модели User (исправлено)
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    first_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    last_name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false, // отключаем автоматические timestamps, т.к. определили свои
    tableName: 'users'
});

// Синхронизация (лучше использовать alter вместо force в production)
sequelize.sync({ alter: true });

// CRUD операции

// Создание нового пользователя
app.post('/api/users', async (req, res) => {
    try {
        const user = await User.create(req.body);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Получение списка пользователей
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Получение пользователя по id
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Обновление информации пользователя
app.patch('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        // Обновляем updated_at при изменении
        const updatedData = {
            ...req.body,
            updated_at: new Date()
        };
        
        await user.update(updatedData);
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Удаление пользователя
app.delete('/api/users/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        await user.destroy();
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});