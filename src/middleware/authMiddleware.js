import jwt from 'jsonwebtoken';

export function authenticationToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.json('Token not found');

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.json('Invalid token');
        req.user = user;
        next();
    });
}

export function roleMiddleware(...roles) {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.json('Unauthorized');
        }
        next();
    }
}