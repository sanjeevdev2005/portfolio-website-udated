const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.cookies.adminToken;

    if (!token) {
        return res.status(401).json({
            message: "Access denied. Please log in.",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.adminId = decoded.id;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired session.",
        });
    }
}

module.exports = authMiddleware;