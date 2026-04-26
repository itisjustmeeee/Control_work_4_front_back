const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
    generateAccessToken,
    generateRefreshToken,
    saveRefreshToken,
    isRefreshTokenValid,
    deleteRefreshToken
} = require('../services/token.service');
const {
    findUserByUsername,
    findUserById,
    createUser,
    getUsers
} = require('../store/users.store');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

REFRESH_SECRET = "new_refresh_secret_hehe";

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = {
        id: String(getUsers().length + 1),
        username,
        passwordHash,
        role: "user",
        blocked: false,
    };

    createUser(user);

    res.json(user);
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const user = findUserByUsername(username);

    if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
        return res.status(401).json({ error: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await saveRefreshToken(user.id, refreshToken);

    res.json({ accessToken, refreshToken });
});

router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "No token" });
    }

    const exists = await isRefreshTokenValid(refreshToken);
    if (!exists) {
        return res.status(401).json({ error: "Invalid token" });
    }

    try {
        const payload = jwt.verify(refreshToken, REFRESH_SECRET);

        const user =  findUserById(payload.sub);
        if (!user) {
            return res.status(401).json({ error: "User not found" });
        }

        await deleteRefreshToken(refreshToken);

        const newAccessToken = generateAccessToken(user);
        const newRefreshToken = generateRefreshToken(user);

        await saveRefreshToken(user.id, newRefreshToken);

        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch {
        return res.status(401).json({ error: "Expired token" });
    }
});

router.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: "No token" });
    }

    await deleteRefreshToken(refreshToken);

    res.json({ message: "Logged out" });
});

router.get('/me', authMiddleware, async (req, res) => {
    await res.json(req.user);
});

module.exports = router;