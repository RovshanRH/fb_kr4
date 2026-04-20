const mongoose = require('mongoose');
const express = require('express');
const app = express()

// схема юзера
const userSchema = new mongoose.Schema({
    ID: { type: Number, unique: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    age: { type: Number, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now }
})
// Авто ID
userSchema.pre('save', async function (next) {
    if (this.isNew) {
        const lastUser = await this.constructor.findOne({}, {}, { sort: { 'ID': -1 } });
        this.ID = lastUser ? lastUser.ID + 1 : 1;
    }
});

const User = mongoose.model('User', userSchema);

// конект с монгодб
mongoose.connect('mongodb://YourMongoAdmin:1234@localhost:27017/admin')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

app.use(express.json());

// api
// post
app.post('/api/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user)
    }
    catch (err) {
        res.status(400).json({ error: err.message })
    }
})
// get
app.get('/api/users', async (req, res) => {
    try {
        const users = await User.find()
        res.send(users)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
})
// get по id
app.get('/api/users/:id', async (req, res) => {
    try {
        const user = await User.find({ ID: { $eq: req.params.id } })
        res.send(user)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// patch
app.patch('/api/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID must be a number' });
        }

        // Автоматически обновляем поле updated_at
        const updateData = {
            ...req.body,
            updated_at: Date.now()
        };

        const user = await User.findOneAndUpdate(
            { ID: req.params.id },
            updateData,
            { new: true, runValidators: true }
        );

        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// delete
app.delete('/api/users/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        
        // Проверка на валидное число
        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID must be a number' });
        }
        
        const user = await User.findOneAndDelete({ ID: id });
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        
        res.json({ message: 'User deleted successfully', user });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});


app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});