const express = require('express');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = 3000;

connectDB();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API is working');
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is working on http://localhost:${PORT}`);
});