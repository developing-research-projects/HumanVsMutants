const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Unauthenticated' });
            }
            req.user = user;

            const adminUsernames = process.env.ADMIN_USERNAMES.split(',');
            req.user.role = adminUsernames.includes(user.username) ? 'admin' : 'student';

            next();
        });
    } else {
        res.sendStatus(401);
    }
};

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
