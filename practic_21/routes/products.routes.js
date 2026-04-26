const express = require('express');
const cacheMiddleware = require('../middleware/cache.middleware');
const { setCache, deleteCache } = require('../services/cache.service');

const router = express.Router();

const products = [];

router.get('/', cacheMiddleware(() => "products:all", 600), async (req, res) => {
    await setCache(req.cacheKey, products, req.cacheTTL);

    res.json({
        source: "server",
        data: products,
    });
});

router.post('/', async (req, res) => {
    const { name, price, description } = req.body;

    const product = {
        id: String(products.length + 1),
        name,
        price,
        description
    };

    products.push(product);

    await deleteCache("products:all");

    res.status(201).json(product);
});

router.get('/:id', cacheMiddleware((req) => `products:${req.params.id}`, 600), async (req, res) => {
    const product = products.find(p => p.id === req.params.id);

    if (!product) {
        return res.status(404).json({ error: "Product not found" });
    }

    await setCache(req.cacheKey, product, req.cacheTTL);

    res.json({
        source: "server",
        data: product,
    });
});

module.exports = router;