const jwt = require('jsonwebtoken');
const { redisClient } = require('../config/redis');

const ACCESS_SECRET = "new_access_secret_hehe";
const REFRESH_SECRET = "new_refresh_secret_hehe";

const ACCESS_EXPIRES_IN = "15m";
const REFRESH_EXPIRES_IN = "7d";

function generateAccessToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            username: user.username,
            role: user.role,
        },
        ACCESS_SECRET,
        {
            expiresIn: ACCESS_EXPIRES_IN
        }
    );
}

function generateRefreshToken(user) {
    return jwt.sign(
        {
            sub: user.id,
            username: user.username,
            role: user.role,
        },
        REFRESH_SECRET,
        {
            expiresIn: REFRESH_EXPIRES_IN
        }
    );
}

async function saveRefreshToken(userId, token) {
    await redisClient.set(
        `refresh:${token}`,
        userId,
        {
            EX: 60 * 60 * 24 * 7,
        }
    );
}

async function isRefreshTokenValid(token) {
    const data =  await redisClient.get(`refresh:${token}`);
    return !!data;
}

async function deleteRefreshToken(token) {
    await redisClient.del(`refresh:${token}`);
}

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    saveRefreshToken,
    isRefreshTokenValid,
    deleteRefreshToken
};