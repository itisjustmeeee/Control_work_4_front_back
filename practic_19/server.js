// практика #19
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API running');
});

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

app.listen(PORT, async () => {
    try {
        await pool.connect();
        console.log('Connected to PostgreSQL');
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    } catch (err) {
        console.error('Ошибка подключения к БД:', err);
    }
});