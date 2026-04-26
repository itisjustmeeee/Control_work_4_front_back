const express = require('express');
const { getUsers, findUserById } = require('../store/users.store');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const cacheMiddleware = require('../middleware/cache.middleware');
const { setCache, deleteCache } = require('../services/cache.service');

const router = express.Router();

router.get('/', authMiddleware, roleMiddleware(['admin']), cacheMiddleware(() => "users:all", 60), async (req, res) => {
    const users = getUsers();

    await setCache(req.cacheKey, users, req.cacheTTL);

    res.json({
        source: "server",
        data: users,
    });
});

router.get('/:id', authMiddleware, roleMiddleware(['admin']), cacheMiddleware((req) => `users:${req.params.id}`, 60), async (req, res) => {
    const user = findUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    await setCache(req.cacheKey, user, req.cacheTTL);

    res.json({
        source: "server",
        data: user,
    });
});

router.put('/:id', async (req, res) => {
    const user = findUserById(req.params.id);

    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }

    Object.assign(user, req.body);

    await deleteCache("users:all");
    await deleteCache(`users:${req.params.id}`);

    res.json(user);
});

module.exports = router;