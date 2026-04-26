const { redisClient } = require('../config/redis');

async function getCache(key) {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
}

async function setCache(key, data, ttl) {
    await redisClient.set(key, JSON.stringify(data), {
        EX: ttl,
    });
}

async function deleteCache(key) {
    await redisClient.del(key);
}

module.exports = {
    getCache,
    setCache,
    deleteCache
};