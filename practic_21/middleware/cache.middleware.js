const { getCache } = require('../services/cache.service');

function cacheMiddleware(keyBuilder, ttl) {
    return async (req, res, next) => {
        try {
            const key = keyBuilder(req);
            const cached = await getCache(key);

            if (cached) {
                return res.json({
                    source: "cache",
                    data: cached,
                });
            }

            req.cacheKey = key;
            req.cacheTTL = ttl;
            next();
        } catch (err) {
            console.error("Cache error:", err);
            next();
        }
    };
}

module.exports = cacheMiddleware;