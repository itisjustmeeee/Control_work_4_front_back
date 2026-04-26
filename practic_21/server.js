const express = require('express');
const { connectRedis } = require('./config/redis');

const authRoutes = require('./routes/auth.routes');
const usersRoutes = require('./routes/users.routes');
const productRoutes = require('./routes/products.routes');

const app = express();
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/products', productRoutes);

const PORT = 3000;

connectRedis().then(() => {
    app.listen(PORT, () => {
        console.log(`server is running at: http://localhost:${PORT}`)
    });
});