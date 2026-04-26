const jwt = require('jsonwebtoken');
const ACCESS_SECRET = "new_access_secret_hehe";

function authMiddleware(req, res, next) {
    const header = req.headers.authorization || "";
    const [ scheme, token ] = header.split(" ");

    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ error: "Missing or Invalid Authorization header" });
    }

    try {
        const payload = jwt.verify(token, ACCESS_SECRET);

        req.user = payload;
        next();
    } catch {
        return res.status(401).json({ error: "Invalid or expired token" });
    }
}

module.exports = authMiddleware;